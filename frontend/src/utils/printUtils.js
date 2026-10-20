// Official ELAKIYAA Printing Utility for Single Person Statements & Slips

export function printIndividualRecord({ title, person, type, records = [], summary = {} }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print records');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let tableHeaderHtml = '';
  let tableRowsHtml = '';

  if (type === 'attendance') {
    tableHeaderHtml = `
      <tr>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">DATE</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">PUNCH IN</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">PUNCH OUT</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">LOCATION / STATION</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">STATUS</th>
      </tr>
    `;
    tableRowsHtml = records.map(r => `
      <tr>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-family:monospace; font-size:11px;">${r.date || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-weight:bold; font-size:11px;">${r.punchIn || r.in || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px;">${r.punchOut || r.out || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px;">${r.location || r.bunk || 'Office / Station'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px;">
          <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:10px; text-transform:uppercase; ${
            r.status === 'present' ? 'background:#dcfce7; color:#166534;' :
            r.status === 'late' ? 'background:#fef9c3; color:#854d0e;' : 'background:#fee2e2; color:#991b1b;'
          }">
            ${r.status} ${r.lateMinutes > 0 ? `(+${r.lateMinutes}m)` : ''}
          </span>
        </td>
      </tr>
    `).join('');
  } else if (type === 'salary') {
    tableHeaderHtml = `
      <tr>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">MONTH</th>
        <th style="padding:8px 10px; text-align:right; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">BASIC PAY</th>
        <th style="padding:8px 10px; text-align:right; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">ALLOWANCE</th>
        <th style="padding:8px 10px; text-align:right; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">DEDUCTION</th>
        <th style="padding:8px 10px; text-align:right; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">NET SALARY</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">PAYMENT STATUS</th>
      </tr>
    `;
    tableRowsHtml = records.map(r => `
      <tr>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-weight:bold; font-size:11px;">${r.month || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; text-align:right; font-family:monospace; font-size:11px;">₹${(r.basic || 0).toLocaleString('en-IN')}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; text-align:right; font-family:monospace; color:#166534; font-size:11px;">+₹${(r.allowance || 0).toLocaleString('en-IN')}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; text-align:right; font-family:monospace; color:#dc2626; font-size:11px;">-₹${(r.deduction || 0).toLocaleString('en-IN')}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; text-align:right; font-family:monospace; font-weight:bold; font-size:12px;">₹${((r.netSalary || r.net || (r.basic + r.allowance - r.deduction)) || 0).toLocaleString('en-IN')}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px;">
          <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:10px; ${
            r.status === 'paid' ? 'background:#dcfce7; color:#166534;' : 'background:#fef9c3; color:#854d0e;'
          }">
            ${r.status ? r.status.toUpperCase() : 'PENDING'}
          </span>
        </td>
      </tr>
    `).join('');
  } else if (type === 'leaves') {
    tableHeaderHtml = `
      <tr>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">LEAVE TYPE</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">FROM</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">TO</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">REASON & NOTES</th>
        <th style="padding:8px 10px; text-align:left; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px;">STATUS</th>
      </tr>
    `;
    tableRowsHtml = records.map(r => `
      <tr>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-weight:bold; font-size:11px;">${r.leaveType || 'Leave'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-family:monospace; font-size:11px;">${r.fromDate || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-family:monospace; font-size:11px;">${r.toDate || '—'}</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px; font-style:italic;">"${r.reason || 'Personal'}"</td>
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px;">
          <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:10px; text-transform:uppercase; ${
            r.status === 'approved' ? 'background:#dcfce7; color:#166534;' :
            r.status === 'rejected' ? 'background:#fee2e2; color:#991b1b;' : 'background:#fef9c3; color:#854d0e;'
          }">
            ${r.status}
          </span>
        </td>
      </tr>
    `).join('');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${person.name || 'Person'} - ${title}</title>
        <style>
          @page { size: auto; margin: 10mm 15mm; }
          * { margin:0; padding:0; box-sizing:border-box; font-family: 'Segoe UI', Arial, sans-serif; }
          body { padding: 24px; color: #1e293b; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .company-title { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .company-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .person-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          .person-item { font-size: 11px; }
          .person-label { color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
          .person-val { font-size: 12px; font-weight: bold; color: #0f172a; }
          .report-title-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .report-heading { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e40af; border-left: 3px solid #1e40af; padding-left: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 20px; }
          .sign-area { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569; }
          .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="/logo.png" style="height:44px; width:auto; object-fit:contain;" alt="ELAKIYAA Logo" />
            <div>
              <div class="company-title">ELAKIYAA - JOBS MADE SIMPLE</div>
              <div class="company-sub">Official Manpower & Staff Management Records</div>
            </div>
          </div>
          <div style="text-align:right; font-size:11px; color:#64748b;">
            <div>Statement Date: <strong>${dateStr}</strong></div>
            <div>Time: ${timeStr}</div>
          </div>
        </div>

        <div class="person-card">
          <div class="person-item">
            <div class="person-label">Person Name</div>
            <div class="person-val">${person.name || '—'}</div>
          </div>
          <div class="person-item">
            <div class="person-label">ID / Code</div>
            <div class="person-val">${person.staffId || person.clientId || person.managerId || person.id || '—'}</div>
          </div>
          <div class="person-item">
            <div class="person-label">Mobile Contact</div>
            <div class="person-val">${person.mobile || '—'}</div>
          </div>
          <div class="person-item">
            <div class="person-label">Designation / Role</div>
            <div class="person-val">${person.roleAtBunk || (person.role ? person.role.toUpperCase() : 'Staff')}</div>
          </div>
          ${person.assignedBunk ? `
          <div class="person-item" style="grid-column: span 2;">
            <div class="person-label">Assigned Work Station / Bunk</div>
            <div class="person-val">${person.assignedBunk}</div>
          </div>
          ` : ''}
          ${person.shift ? `
          <div class="person-item" style="grid-column: span 2;">
            <div class="person-label">Assigned Shift Timing</div>
            <div class="person-val">${person.shift}</div>
          </div>
          ` : ''}
        </div>

        <div class="report-title-bar">
          <div class="report-heading">${title}</div>
          <div style="font-size:11px; color:#64748b; font-weight:600;">Total Records: ${records.length}</div>
        </div>

        <table>
          <thead>${tableHeaderHtml}</thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>

        <div class="sign-area">
          <div>
            <p>Employee / Candidate Signature</p>
            <div style="margin-top:35px; border-bottom:1px solid #94a3b8; width:180px;"></div>
          </div>
          <div style="text-align:right;">
            <p>Authorized Signatory</p>
            <p style="font-weight:bold; color:#0f172a; margin-top:4px;">ELAKIYAA - JOBS MADE SIMPLE</p>
            <div style="margin-top:25px; border-bottom:1px solid #94a3b8; width:180px; margin-left:auto;"></div>
          </div>
        </div>

        <div class="footer">
          This is an official system-generated record from ELAKIYAA Jobs Made Simple Management System. Valid without stamp unless specified.
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 400);
}

// Official ELAKIYAA Printing Utility for Bulk / Total Statements (All Records)
export function printBulkRecords({ title, subtitle = '', columns = [], rows = [], summaryCards = [] }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print records');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const headerHtml = columns.map(c => `
    <th style="padding:8px 10px; text-align:${c.align || 'left'}; border:1px solid #cbd5e1; background:#f8fafc; font-size:11px; font-weight:bold; color:#334155;">
      ${c.header}
    </th>
  `).join('');

  const rowsHtml = rows.map((r, idx) => `
    <tr style="${idx % 2 === 1 ? 'background:#fafbfc;' : ''}">
      ${columns.map(c => `
        <td style="padding:7px 10px; border:1px solid #e2e8f0; font-size:11px; text-align:${c.align || 'left'}; ${c.style || ''}">
          ${c.render ? c.render(r) : (r[c.key] !== undefined && r[c.key] !== null ? r[c.key] : '—')}
        </td>
      `).join('')}
    </tr>
  `).join('');

  const summaryHtml = summaryCards.length > 0 ? `
    <div style="display:flex; gap:12px; margin-bottom:16px;">
      ${summaryCards.map(s => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; min-width:140px;">
          <div style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">${s.label}</div>
          <div style="font-size:16px; font-weight:bold; color:#0f172a; margin-top:2px;">${s.value}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ELAKIYAA - ${title}</title>
        <style>
          @page { size: auto; margin: 10mm 15mm; }
          * { margin:0; padding:0; box-sizing:border-box; font-family: 'Segoe UI', Arial, sans-serif; }
          body { padding: 24px; color: #1e293b; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .company-title { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .company-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .report-title-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .report-heading { font-size: 15px; font-weight: bold; text-transform: uppercase; color: #1e40af; border-left: 3px solid #1e40af; padding-left: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 24px; }
          .sign-area { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569; }
          .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="/logo.png" style="height:44px; width:auto; object-fit:contain;" alt="ELAKIYAA Logo" />
            <div>
              <div class="company-title">ELAKIYAA - JOBS MADE SIMPLE</div>
              <div class="company-sub">Official Manpower & Staff Management Records</div>
            </div>
          </div>
          <div style="text-align:right; font-size:11px; color:#64748b;">
            <div>Statement Date: <strong>${dateStr}</strong></div>
            <div>Time: ${timeStr}</div>
          </div>
        </div>

        <div class="report-title-bar">
          <div>
            <div class="report-heading">${title}</div>
            ${subtitle ? `<div style="font-size:11px; color:#64748b; margin-top:3px; padding-left:11px;">${subtitle}</div>` : ''}
          </div>
          <div style="font-size:11px; color:#64748b; font-weight:600;">Total Records: ${rows.length}</div>
        </div>

        ${summaryHtml}

        <table>
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <div class="sign-area">
          <div>
            <p>Verified By (Operations In-Charge)</p>
            <div style="margin-top:35px; border-bottom:1px solid #94a3b8; width:180px;"></div>
          </div>
          <div style="text-align:right;">
            <p>Authorized Signatory</p>
            <p style="font-weight:bold; color:#0f172a; margin-top:4px;">ELAKIYAA - JOBS MADE SIMPLE</p>
            <div style="margin-top:25px; border-bottom:1px solid #94a3b8; width:180px; margin-left:auto;"></div>
          </div>
        </div>

        <div class="footer">
          This is an official bulk report from ELAKIYAA Jobs Made Simple Management System. Valid without stamp unless specified.
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 400);
}

