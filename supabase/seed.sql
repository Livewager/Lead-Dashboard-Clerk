-- Seed script for testing data
-- Run this after applying the migration

-- Insert sample leads
INSERT INTO public.leads (tier, status, price_cents, score, city, region, summary) VALUES
('warm', 'available', 2500, 75.5, 'Vancouver', 'Downtown', 'Seeking comprehensive beauty consultation for special event'),
('hot', 'available', 4500, 88.2, 'Burnaby', 'Metrotown', 'Interested in full facial treatment and skincare routine'),
('platinum', 'available', 7500, 95.0, 'West Vancouver', 'Ambleside', 'Looking for premium anti-aging treatments and consultation'),
('warm', 'available', 1800, 68.3, 'Richmond', 'Steveston', 'First-time client interested in basic facial services'),
('hot', 'available', 3200, 82.1, 'North Vancouver', 'Lonsdale', 'Regular client seeking advanced treatment options'),
('warm', 'available', 2200, 71.8, 'Surrey', 'Guildford', 'Student looking for affordable beauty services'),
('platinum', 'available', 8500, 92.4, 'Vancouver', 'Kitsilano', 'High-end client interested in luxury spa treatments'),
('hot', 'available', 3800, 85.7, 'Coquitlam', 'Town Centre', 'Professional seeking regular maintenance treatments'),
('warm', 'available', 2000, 69.2, 'New Westminster', 'Downtown', 'New to area, looking for trusted beauty provider'),
('hot', 'available', 4200, 87.3, 'Vancouver', 'Yaletown', 'Executive seeking convenient downtown location');

-- Insert sample lead photos
INSERT INTO public.lead_photos (lead_id, url, is_primary) 
SELECT 
  l.id,
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  true
FROM public.leads l
WHERE l.tier = 'warm'
LIMIT 5;

INSERT INTO public.lead_photos (lead_id, url, is_primary) 
SELECT 
  l.id,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  true
FROM public.leads l
WHERE l.tier = 'hot'
LIMIT 3;

INSERT INTO public.lead_photos (lead_id, url, is_primary) 
SELECT 
  l.id,
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  true
FROM public.leads l
WHERE l.tier = 'platinum'
LIMIT 2;

-- Add secondary photos for some leads
INSERT INTO public.lead_photos (lead_id, url, is_primary) 
SELECT 
  l.id,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  false
FROM public.leads l
WHERE l.tier IN ('hot', 'platinum')
LIMIT 3;
