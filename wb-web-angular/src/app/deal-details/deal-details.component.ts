ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id')!;
  const qp = this.route.snapshot.queryParamMap;

  // read assumptions from query string (if present)
  const ir = Number(qp.get('ir') || this.finance.interestRate);
  const ltv = Number(qp.get('ltv') || this.finance.ltv);
  const term = Number(qp.get('term') || this.finance.termYears);
  const autorun = qp.get('autorun') === '1';

  this.finance = { interestRate: ir, ltv, termYears: term };

  this.loading = true;
  this.api.getDeal(id).subscribe({
    next: (d) => {
      this.deal = d;
      this.loading = false;
      if (autorun) this.runCalc();
    },
    error: () => { this.loading = false; }
  });
}
