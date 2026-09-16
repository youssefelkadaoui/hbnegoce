(function () {
  const config = window.HB_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey || !window.supabase) return;

  const client = window.supabase.createClient(config.url, config.anonKey);
  window.hbSupabase = client;

  client.from('products').select('payload').order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error;
      const catalog = (data || []).map(row => row.payload).filter(Boolean);
      localStorage.setItem('hb_remote_catalog', JSON.stringify(catalog));
      products = catalog;
      window.dispatchEvent(new CustomEvent('hb-catalog-updated', { detail: catalog }));
    })
    .catch(error => console.warn('تعذر مزامنة المنتجات:', error.message));
}());
