import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create storage bucket on startup
(async () => {
  const bucketName = 'make-2b6147e6-musical-images';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created bucket: ${bucketName}`);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2b6147e6/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ROUTES ==========

// Sign up
app.post("/make-server-2b6147e6/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Sign up failed' }, 500);
  }
});

// ========== MUSICAL ROUTES ==========

// Get all musicals
app.get("/make-server-2b6147e6/musicals", async (c) => {
  try {
    const musicals = await kv.getByPrefix('musical:');
    return c.json({ musicals });
  } catch (error) {
    console.error('Error fetching musicals:', error);
    return c.json({ error: 'Failed to fetch musicals' }, 500);
  }
});

// Get a specific musical
app.get("/make-server-2b6147e6/musicals/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const musical = await kv.get(`musical:${id}`);
    
    if (!musical) {
      return c.json({ error: 'Musical not found' }, 404);
    }
    
    return c.json({ musical });
  } catch (error) {
    console.error('Error fetching musical:', error);
    return c.json({ error: 'Failed to fetch musical' }, 500);
  }
});

// Create or update a musical
app.post("/make-server-2b6147e6/musicals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const musical = await c.req.json();
    const id = musical.id || crypto.randomUUID();
    
    await kv.set(`musical:${id}`, { ...musical, id, updatedAt: new Date().toISOString() });
    
    return c.json({ musical: { ...musical, id } });
  } catch (error) {
    console.error('Error creating musical:', error);
    return c.json({ error: 'Failed to create musical' }, 500);
  }
});

// ========== ACTOR ROUTES ==========

// Get all actors
app.get("/make-server-2b6147e6/actors", async (c) => {
  try {
    const actors = await kv.getByPrefix('actor:');
    return c.json({ actors });
  } catch (error) {
    console.error('Error fetching actors:', error);
    return c.json({ error: 'Failed to fetch actors' }, 500);
  }
});

// Get a specific actor
app.get("/make-server-2b6147e6/actors/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const actor = await kv.get(`actor:${id}`);
    
    if (!actor) {
      return c.json({ error: 'Actor not found' }, 404);
    }
    
    return c.json({ actor });
  } catch (error) {
    console.error('Error fetching actor:', error);
    return c.json({ error: 'Failed to fetch actor' }, 500);
  }
});

// Create or update an actor
app.post("/make-server-2b6147e6/actors", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const actor = await c.req.json();
    const id = actor.id || crypto.randomUUID();
    
    await kv.set(`actor:${id}`, { ...actor, id, updatedAt: new Date().toISOString() });
    
    return c.json({ actor: { ...actor, id } });
  } catch (error) {
    console.error('Error creating actor:', error);
    return c.json({ error: 'Failed to create actor' }, 500);
  }
});

// ========== PERFORMANCE ROUTES ==========

// Get performances for a musical
app.get("/make-server-2b6147e6/performances/musical/:musicalId", async (c) => {
  try {
    const musicalId = c.req.param('musicalId');
    const performances = await kv.getByPrefix(`performance:${musicalId}:`);
    return c.json({ performances });
  } catch (error) {
    console.error('Error fetching performances:', error);
    return c.json({ error: 'Failed to fetch performances' }, 500);
  }
});

// Create a performance
app.post("/make-server-2b6147e6/performances", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const performance = await c.req.json();
    const id = performance.id || crypto.randomUUID();
    
    await kv.set(`performance:${performance.musicalId}:${id}`, { ...performance, id, updatedAt: new Date().toISOString() });
    
    return c.json({ performance: { ...performance, id } });
  } catch (error) {
    console.error('Error creating performance:', error);
    return c.json({ error: 'Failed to create performance' }, 500);
  }
});

// ========== REVIEW ROUTES ==========

// Get reviews for a musical
app.get("/make-server-2b6147e6/reviews/musical/:musicalId", async (c) => {
  try {
    const musicalId = c.req.param('musicalId');
    const reviews = await kv.getByPrefix(`review:musical:${musicalId}:`);
    return c.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// Create a review
app.post("/make-server-2b6147e6/reviews", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const review = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`review:${review.type}:${review.targetId}:${id}`, { 
      ...review, 
      id, 
      userId: user.id,
      createdAt: new Date().toISOString() 
    });
    
    return c.json({ review: { ...review, id, userId: user.id } });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

// ========== SEAT VIEW ROUTES ==========

// Get seat views for a venue
app.get("/make-server-2b6147e6/seatviews/venue/:venueId", async (c) => {
  try {
    const venueId = c.req.param('venueId');
    const seatViews = await kv.getByPrefix(`seatview:${venueId}:`);
    return c.json({ seatViews });
  } catch (error) {
    console.error('Error fetching seat views:', error);
    return c.json({ error: 'Failed to fetch seat views' }, 500);
  }
});

// Create a seat view
app.post("/make-server-2b6147e6/seatviews", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const seatView = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`seatview:${seatView.venueId}:${id}`, { 
      ...seatView, 
      id, 
      userId: user.id,
      createdAt: new Date().toISOString() 
    });
    
    return c.json({ seatView: { ...seatView, id, userId: user.id } });
  } catch (error) {
    console.error('Error creating seat view:', error);
    return c.json({ error: 'Failed to create seat view' }, 500);
  }
});

// ========== USER DATA ROUTES ==========

// Get user profile
app.get("/make-server-2b6147e6/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:profile:${user.id}`);
    
    return c.json({ profile: profile || { userId: user.id } });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Update user profile
app.post("/make-server-2b6147e6/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profileData = await c.req.json();
    
    await kv.set(`user:profile:${user.id}`, { 
      ...profileData, 
      userId: user.id,
      updatedAt: new Date().toISOString() 
    });
    
    return c.json({ profile: { ...profileData, userId: user.id } });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// Get user's watched musicals
app.get("/make-server-2b6147e6/user/watched", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const watched = await kv.getByPrefix(`user:watched:${user.id}:`);
    
    return c.json({ watched });
  } catch (error) {
    console.error('Error fetching watched musicals:', error);
    return c.json({ error: 'Failed to fetch watched musicals' }, 500);
  }
});

// Add a watched musical
app.post("/make-server-2b6147e6/user/watched", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const watchData = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`user:watched:${user.id}:${id}`, { 
      ...watchData, 
      id,
      userId: user.id,
      watchedAt: new Date().toISOString() 
    });
    
    return c.json({ watched: { ...watchData, id, userId: user.id } });
  } catch (error) {
    console.error('Error adding watched musical:', error);
    return c.json({ error: 'Failed to add watched musical' }, 500);
  }
});

// ========== IMAGE UPLOAD ROUTES ==========

// Upload image
app.post("/make-server-2b6147e6/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const bucketName = 'make-2b6147e6-musical-images';
    const fileName = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload image' }, 500);
    }

    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

    return c.json({ url: signedUrlData?.signedUrl, path: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Get signed URL for an image
app.get("/make-server-2b6147e6/image/:path", async (c) => {
  try {
    const path = c.req.param('path');
    const bucketName = 'make-2b6147e6-musical-images';

    const { data } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year

    if (!data) {
      return c.json({ error: 'Image not found' }, 404);
    }

    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Error fetching image:', error);
    return c.json({ error: 'Failed to fetch image' }, 500);
  }
});

Deno.serve(app.fetch);
