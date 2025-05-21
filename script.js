// Intersection Observer for section reveals
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  sections.forEach(section => observer.observe(section));
});

// Contact form validation & submit simulation with saving enquiries to localStorage
function handleSubmit(e){
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Basic validation
  let valid = true;

  if(!name){
    valid = false;
    showError('nameHelp');
  } else {
    hideError('nameHelp');
  }
  if(!email || !validateEmail(email)) {
    valid = false;
    showError('emailHelp');
  } else {
    hideError('emailHelp');
  }
  if(!message){
    valid = false;
    showError('messageHelp');
  } else {
    hideError('messageHelp');
  }

  if(!valid) {
    return;
  }

  // Save enquiry to localStorage
  saveEnquiry({name, email, message, date: new Date().toISOString()});

  alert(`Thank you, ${name}! Your message has been sent.`);
  form.reset();
}
function showError(id){
  document.getElementById(id).style.display = 'block';
}
function hideError(id){
  document.getElementById(id).style.display = 'none';
}
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function saveEnquiry(enquiry) {
  let enquiries = JSON.parse(localStorage.getItem('enquiries')) || [];
  enquiries.push(enquiry);
  localStorage.setItem('enquiries', JSON.stringify(enquiries));
}

// Create and download Excel file from enquiries
function downloadExcelFromEnquiries() {
  let enquiries = JSON.parse(localStorage.getItem('enquiries')) || [];
  if(enquiries.length === 0){
    alert('No enquiries to download.');
    return;
  }

  // Using CSV format which can be opened in Excel
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Email,Message,Date\n";

  enquiries.forEach(enq => {
    // Escape quotes and commas in values by wrapping in quotes and doubling internal quotes
    const esc = s => `"${s.replace(/""/g, '""').replace(/"/g, '""')}"`;
    csvContent += `${esc(enq.name)},${esc(enq.email)},${esc(enq.message)},${esc(enq.date)}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const dateStr = new Date().toISOString().slice(0,10);
  link.setAttribute("download", `enquiries_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById('downloadExcelBtn').addEventListener('click', downloadExcelFromEnquiries);

