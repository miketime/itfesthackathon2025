-- Mock data: 50 posts with 2 comments and 2 likes each
-- User IDs: 5a898891-b4eb-496e-8935-b76d97e360fd, 6369ea5c-d25d-4b8e-b4ab-5af03924a858,
--           8411a5e7-3406-43ca-a7b4-fff0705bfeb9, 99a63d8b-bd7e-40af-9066-fd0dfc22571c

-- Insert 50 posts (spread evenly across 47 subgroups)
INSERT INTO posts (content, user_id, subgroup_id, created_at) VALUES
('Just finished an amazing workout session! Feeling energized and ready for the week ahead. 💪', '5a898891-b4eb-496e-8935-b76d97e360fd', 1, NOW() - INTERVAL '10 days'),
('Does anyone have recommendations for good running shoes? Looking to upgrade my gear.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 2, NOW() - INTERVAL '9 days'),
('The new superhero movie was absolutely incredible! Best action sequences I''ve seen all year.', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 3, NOW() - INTERVAL '8 days'),
('Learning React has been such a rewarding journey. The component model just makes sense!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 4, NOW() - INTERVAL '7 days'),
('Started reading a fascinating book on ancient history. Anyone else into historical non-fiction?', '5a898891-b4eb-496e-8935-b76d97e360fd', 5, NOW() - INTERVAL '6 days'),
('My garden is finally blooming! There''s nothing quite like growing your own vegetables.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 6, NOW() - INTERVAL '5 days'),
('Just got back from an amazing hiking trip in the mountains. The views were breathtaking!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 7, NOW() - INTERVAL '4 days'),
('Experimented with a new pasta recipe today. Turned out better than expected!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 8, NOW() - INTERVAL '3 days'),
('The latest album from my favorite band just dropped and it''s fire! 🎵', '5a898891-b4eb-496e-8935-b76d97e360fd', 9, NOW() - INTERVAL '2 days'),
('Anyone else struggling with work-life balance? Looking for tips and strategies.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 10, NOW() - INTERVAL '1 day'),
('Completed my first 5K race today! Small victories matter. 🏃‍♂️', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 11, NOW() - INTERVAL '23 hours'),
('The documentary on climate change was eye-opening. We need to act now.', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 12, NOW() - INTERVAL '22 hours'),
('My photography skills are improving! Finally understanding aperture and shutter speed.', '5a898891-b4eb-496e-8935-b76d97e360fd', 13, NOW() - INTERVAL '21 hours'),
('Just adopted a rescue dog! Meet Max, the goodest boy. 🐕', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 14, NOW() - INTERVAL '20 hours'),
('Finished decorating my home office. Productivity through the roof!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 15, NOW() - INTERVAL '19 hours'),
('Learning Spanish through apps has been surprisingly effective. ¡Hola amigos!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 16, NOW() - INTERVAL '18 hours'),
('The indie game I''ve been working on is almost ready for beta testing!', '5a898891-b4eb-496e-8935-b76d97e360fd', 17, NOW() - INTERVAL '17 hours'),
('Sunset painting session today. Nature is the best inspiration for art.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 18, NOW() - INTERVAL '16 hours'),
('Just discovered an amazing coffee shop downtown. Their espresso is perfection!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 19, NOW() - INTERVAL '15 hours'),
('Meditation has completely changed my life. Highly recommend starting with 5 minutes daily.', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 20, NOW() - INTERVAL '14 hours'),
('My sourdough bread finally turned out perfect! The crust is amazing.', '5a898891-b4eb-496e-8935-b76d97e360fd', 21, NOW() - INTERVAL '13 hours'),
('Started volunteering at the local animal shelter. It''s incredibly rewarding work.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 22, NOW() - INTERVAL '12 hours'),
('The new season of my favorite show just started. No spoilers please!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 23, NOW() - INTERVAL '11 hours'),
('Switched to a standing desk and my back pain is already improving!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 24, NOW() - INTERVAL '10 hours'),
('Beach day with friends was exactly what I needed. Sun, sand, and good vibes!', '5a898891-b4eb-496e-8935-b76d97e360fd', 25, NOW() - INTERVAL '9 hours'),
('My indoor plants are thriving! Here are my top care tips for beginners.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 26, NOW() - INTERVAL '8 hours'),
('Just finished building my first PC! The cable management was challenging but worth it.', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 27, NOW() - INTERVAL '7 hours'),
('Yoga in the morning has become my favorite routine. Starting the day right!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 28, NOW() - INTERVAL '6 hours'),
('The farmer''s market had such fresh produce today. Supporting local is important!', '5a898891-b4eb-496e-8935-b76d97e360fd', 29, NOW() - INTERVAL '5 hours'),
('Finally organized my bookshelf by color. It looks so aesthetic now!', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 30, NOW() - INTERVAL '4 hours'),
('Trying out intermittent fasting. Anyone have experience with this?', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 31, NOW() - INTERVAL '3 hours'),
('My first attempt at pottery was... interesting. But I''m hooked!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 32, NOW() - INTERVAL '2 hours'),
('The stargazing event last night was magical. Saw so many shooting stars!', '5a898891-b4eb-496e-8935-b76d97e360fd', 33, NOW() - INTERVAL '1 hour'),
('Learning to play guitar. My fingers hurt but I''m not giving up!', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 34, NOW() - INTERVAL '50 minutes'),
('Just meal prepped for the entire week. Future me will be so grateful!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 35, NOW() - INTERVAL '40 minutes'),
('The art exhibition downtown is absolutely stunning. Highly recommend visiting!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 36, NOW() - INTERVAL '30 minutes'),
('Finished refurbishing an old vintage chair. DIY projects are so satisfying!', '5a898891-b4eb-496e-8935-b76d97e360fd', 37, NOW() - INTERVAL '25 minutes'),
('My bullet journal setup for next month is done. Love planning ahead!', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 38, NOW() - INTERVAL '20 minutes'),
('Tried rock climbing for the first time. What an adrenaline rush!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 39, NOW() - INTERVAL '15 minutes'),
('The new podcast I discovered is so informative. Perfect for commutes!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 40, NOW() - INTERVAL '12 minutes'),
('Baked chocolate chip cookies and they turned out perfect! Recipe in comments.', '5a898891-b4eb-496e-8935-b76d97e360fd', 41, NOW() - INTERVAL '10 minutes'),
('Started journaling daily and it''s helping me process emotions better.', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 42, NOW() - INTERVAL '8 minutes'),
('The sunrise this morning was absolutely breathtaking. Worth waking up early!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 43, NOW() - INTERVAL '6 minutes'),
('My coding project finally works after hours of debugging. Best feeling ever!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 44, NOW() - INTERVAL '5 minutes'),
('Discovered a hidden gem restaurant in my neighborhood. The food is incredible!', '5a898891-b4eb-496e-8935-b76d97e360fd', 45, NOW() - INTERVAL '4 minutes'),
('My minimalism journey continues. Decluttering feels so freeing!', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 46, NOW() - INTERVAL '3 minutes'),
('The board game night with friends was so much fun. We need to do this more often!', '8411a5e7-3406-43ca-a7b4-fff0705bfeb9', 47, NOW() - INTERVAL '2 minutes'),
('Learning about personal finance and investing. Better late than never!', '99a63d8b-bd7e-40af-9066-fd0dfc22571c', 1, NOW() - INTERVAL '1 minute'),
('My weekend camping trip was amazing. Disconnecting from technology is therapeutic.', '5a898891-b4eb-496e-8935-b76d97e360fd', 2, NOW() - INTERVAL '30 seconds'),
('Just finished a challenging puzzle. 1000 pieces of pure satisfaction!', '6369ea5c-d25d-4b8e-b4ab-5af03924a858', 3, NOW() - INTERVAL '15 seconds');

-- Now add 2 comments per post (100 comments total)
DO $$
DECLARE
    post_record RECORD;
    comment_users UUID[] := ARRAY[
        '5a898891-b4eb-496e-8935-b76d97e360fd'::UUID,
        '6369ea5c-d25d-4b8e-b4ab-5af03924a858'::UUID,
        '8411a5e7-3406-43ca-a7b4-fff0705bfeb9'::UUID,
        '99a63d8b-bd7e-40af-9066-fd0dfc22571c'::UUID
    ];
    commenter1 UUID;
    commenter2 UUID;
    comment_texts TEXT[] := ARRAY[
        'This is amazing! Thanks for sharing.',
        'I completely agree with this!',
        'Great post! Very insightful.',
        'Love this! Keep it up!',
        'This is so helpful, thank you!',
        'Wow, this is incredible!',
        'I''ve been thinking about this too!',
        'Such a great perspective!',
        'This made my day!',
        'Thanks for the inspiration!',
        'I need to try this!',
        'This is exactly what I needed to hear.',
        'Fantastic work!',
        'Can''t wait to see more!',
        'This is so relatable!',
        'You''re absolutely right!',
        'Amazing content as always!',
        'This deserves more attention!',
        'So glad you shared this!',
        'This is brilliant!'
    ];
    idx INTEGER := 1;
BEGIN
    -- Get all newly created posts and add comments
    FOR post_record IN
        SELECT id, user_id, created_at FROM posts ORDER BY created_at DESC LIMIT 50
    LOOP
        -- Select 2 different commenters (not the post author)
        commenter1 := comment_users[(idx % 4) + 1];
        IF commenter1 = post_record.user_id THEN
            commenter1 := comment_users[((idx + 1) % 4) + 1];
        END IF;

        commenter2 := comment_users[((idx + 2) % 4) + 1];
        IF commenter2 = post_record.user_id OR commenter2 = commenter1 THEN
            commenter2 := comment_users[((idx + 3) % 4) + 1];
            IF commenter2 = post_record.user_id THEN
                commenter2 := comment_users[((idx + 1) % 4) + 1];
            END IF;
        END IF;

        -- Insert first comment
        INSERT INTO comments (post_id, user_id, content, parent_comment_id, created_at)
        VALUES (
            post_record.id,
            commenter1,
            comment_texts[(idx % 20) + 1],
            NULL,
            post_record.created_at + INTERVAL '1 hour'
        );

        -- Insert second comment
        INSERT INTO comments (post_id, user_id, content, parent_comment_id, created_at)
        VALUES (
            post_record.id,
            commenter2,
            comment_texts[((idx + 10) % 20) + 1],
            NULL,
            post_record.created_at + INTERVAL '2 hours'
        );

        idx := idx + 1;
    END LOOP;
END $$;

-- Add 2 likes per post (100 likes total)
DO $$
DECLARE
    post_record RECORD;
    liker_users UUID[] := ARRAY[
        '5a898891-b4eb-496e-8935-b76d97e360fd'::UUID,
        '6369ea5c-d25d-4b8e-b4ab-5af03924a858'::UUID,
        '8411a5e7-3406-43ca-a7b4-fff0705bfeb9'::UUID,
        '99a63d8b-bd7e-40af-9066-fd0dfc22571c'::UUID
    ];
    liker1 UUID;
    liker2 UUID;
    idx INTEGER := 1;
BEGIN
    -- Get all newly created posts and add likes
    FOR post_record IN
        SELECT id, user_id, created_at FROM posts ORDER BY created_at DESC LIMIT 50
    LOOP
        -- Select 2 different likers (not the post author)
        liker1 := liker_users[(idx % 4) + 1];
        IF liker1 = post_record.user_id THEN
            liker1 := liker_users[((idx + 1) % 4) + 1];
        END IF;

        liker2 := liker_users[((idx + 2) % 4) + 1];
        IF liker2 = post_record.user_id OR liker2 = liker1 THEN
            liker2 := liker_users[((idx + 3) % 4) + 1];
            IF liker2 = post_record.user_id THEN
                liker2 := liker_users[((idx + 1) % 4) + 1];
            END IF;
        END IF;

        -- Insert first like
        INSERT INTO post_likes (user_id, post_id, created_at)
        VALUES (
            liker1,
            post_record.id,
            post_record.created_at + INTERVAL '30 minutes'
        );

        -- Insert second like
        INSERT INTO post_likes (user_id, post_id, created_at)
        VALUES (
            liker2,
            post_record.id,
            post_record.created_at + INTERVAL '45 minutes'
        );

        idx := idx + 1;
    END LOOP;
END $$;

-- Verify the data
SELECT 'Posts created:' as info, COUNT(*) as count FROM posts WHERE created_at >= NOW() - INTERVAL '11 days';
SELECT 'Comments created:' as info, COUNT(*) as count FROM comments WHERE created_at >= NOW() - INTERVAL '11 days';
SELECT 'Likes created:' as info, COUNT(*) as count FROM post_likes WHERE created_at >= NOW() - INTERVAL '11 days';
