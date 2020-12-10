/**
  * PROTOTYPE UNTUK AMBIL DATA SUMMARY DCCS 
  * note! 
  * mesti buat index kolom disposition di table call_log
  * CREATE INDEX call_log_disposition_idx ON call_log(disposition);
  * CREATE INDEX call_log_destination_context ON call_log(destination_context);
  */
let testQuery_001=`SELECT DISTINCT(a.waktu), a.disposition, COUNT(id) AS banyak FROM
( SELECT DATE_TRUNC('hour', start_time::time without time zone) AS waktu, disposition, id from call_log
WHERE start_time BETWEEN '2020-12-10 00:00:00' AND '2020-12-10 23:59:59' )a 
GROUP BY a.waktu, a.disposition ORDER BY a.waktu, a.disposition`;


