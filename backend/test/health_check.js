async function check() {
  try {
    const res = await fetch('http://localhost:5001/api/health');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}
check();
