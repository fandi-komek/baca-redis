/** 
 * TESTING QUERY UNTUK DATA MONITORING 
 * DCCS - TAMARISK
 * AUTODIALER CAMPAIGNs
 */
let testQuery_001   = "SELECT name, begin_time, finish_time FROM campaign WHERE name IN (SELECT DISTINCT(campaign) FROM contact WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') GROUP BY campaign)";
let testQuery_002   = "SELECT DISTINCT(campaign) AS campaign_name, (CASE WHEN disposition is null THEN 'NOT CONTACTED' ELSE 'CONTACTED' END) as disposition, count (customer_id) as banyak from contact WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') group by campaign, disposition"
let testQuery_003   = `SELECT 
y.campaign_name, y.not_contacted, z.total_data, (z.total_data - y.not_contacted)::bigint AS contacted
FROM 
(
SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(customer_id) AS NOT_CONTACTED
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
AND disposition is null
GROUP BY campaign, disposition
)y
,
(
SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(customer_id) AS total_data
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
GROUP BY campaign
)z 
WHERE z.campaign_name=y.campaign_name`;

let testQuery_004   = `SELECT
a.name, a.begin_time, a.finish_time,
b.not_contacted, b.contacted, b.total_data
FROM
(
SELECT name, begin_time, finish_time FROM campaign WHERE name IN (SELECT DISTINCT(campaign) FROM contact WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') GROUP BY campaign)
)a,(
SELECT 
y.campaign_name, y.not_contacted, (z.total_data - y.not_contacted)::bigint AS contacted, z.total_data
FROM 
(
SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(customer_id) AS not_contacted
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
AND disposition is null
GROUP BY campaign, disposition
)y
,
(
SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(customer_id) AS total_data
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
GROUP BY campaign
)z 
WHERE z.campaign_name=y.campaign_name
)b
WHERE b.campaign_name=a.name
ORDER BY a.name`;

let testQuery_005 = `SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(disposition) AS contacted, 
(COUNT(disposition is not null) - COUNT(disposition))::bigint AS not_contacted,
COUNT(disposition is not null) as total_data
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
GROUP BY campaign`;

// 006 -> Paling efektif, testing 18ms
let testQuery_006   = `SELECT
a.name, a.begin_time, a.finish_time, b.contacted, b.not_contacted, b.total_data
FROM
(
SELECT name, begin_time, finish_time FROM campaign WHERE name IN (SELECT DISTINCT(campaign) FROM contact WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') GROUP BY campaign)
)a,(
SELECT
DISTINCT(campaign) AS campaign_name,
COUNT(disposition) AS contacted, 
(COUNT(disposition is not null) - COUNT(disposition))::bigint AS not_contacted,
COUNT(disposition is not null) as total_data
FROM contact
WHERE username IN (SELECT member FROM groups WHERE leader='OMSPV001') 
GROUP BY campaign
)b
WHERE b.campaign_name=a.name
ORDER BY a.name`;

