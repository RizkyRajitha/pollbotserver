const supa = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL; //"https://tzrerendzrvbitzauvra.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supa.createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
