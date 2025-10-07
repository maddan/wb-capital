
const apiInput = document.getElementById('api') as HTMLInputElement;
const list = document.getElementById('list') as HTMLDivElement;
document.getElementById('load')!.addEventListener('click', load);

async function load() {
  list.innerHTML = 'Loading...';
  const base = apiInput.value;
  const res = await fetch(`${base}/deals`);
  const deals = await res.json();
  list.innerHTML = '';
  deals.forEach((d:any) => {
    const el = document.createElement('div');
    el.className = 'deal';
    el.innerHTML = `
      <div><strong>${d.title}</strong></div>
      <div class="muted">${d.address}, ${d.city}, ${d.state}</div>
      <div>Price: $${number(d.price)} | Cap: ${d.capRate ?? '-'}%</div>
      <div>DSCR: ${d.finance?.dscr?.toFixed?.(2) ?? '-'} | Cash Flow Yr1: $${d.finance?.cashFlowYr1 ? number(d.finance.cashFlowYr1) : '-'}</div>
    `;
    list.appendChild(el);
  });
}

function number(n:number){ return (n||0).toLocaleString(); }
