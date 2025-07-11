import { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    dob: '',
    gender: '',
    sumAssured: '',
    modalPremium: '',
    premiumFrequency: 'Yearly',
    pt: '',
    ppt: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tableData, setTableData] = useState([]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return new Date(ageDiff).getUTCFullYear() - 1970;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setTableData([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ageNow = calculateAge(form.dob);
    const {
      sumAssured,
      modalPremium,
      pt,
      ppt
    } = form;

    const sum = Number(sumAssured);
    const premium = Number(modalPremium);
    const ptVal = Number(pt);
    const pptVal = Number(ppt);

    // Frontend validations
    if (ageNow < 23 || ageNow > 56) return setError("Age must be between 23 and 56");
    if (pptVal < 5 || pptVal > 10) return setError("PPT must be between 5 and 10");
    if (ptVal < 10 || ptVal > 20) return setError("PT must be between 10 and 20");
    if (pptVal >= ptVal) return setError("PPT must be less than PT");
    if (premium < 10000 || premium > 50000)
      return setError("Modal Premium must be between ₹10,000 and ₹50,000");
    if (sum < Math.max(premium * 10, 5000000))
      return setError("Sum Assured must be at least 10x Modal Premium or ₹50,00,000");

    setSuccess("✅ Validations passed... generating table");

    try {
      const res = await fetch('http://localhost:3000/api/policy/illustration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dob: form.dob,
          sumAssured: sum,
          modalPremium: premium,
          pt: ptVal,
          ppt: pptVal
        })
      });

      const data = await res.json();

      if (res.ok) {
        setTableData(data.illustration);
        setSuccess("✅ Table generated successfully");
      } else {
        setError(data.message || "Error occurred");
      }
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="container">
      <h2>Policy Input Form</h2>
      <form onSubmit={handleSubmit}>
        <label>DOB:
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />
        </label>
        <label>Gender:
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </label>
        <label>Sum Assured:
          <input type="number" name="sumAssured" value={form.sumAssured} onChange={handleChange} />
        </label>
        <label>Modal Premium:
          <input type="number" name="modalPremium" value={form.modalPremium} onChange={handleChange} />
        </label>
        <label>Premium Frequency:
          <select name="premiumFrequency" value={form.premiumFrequency} onChange={handleChange}>
            <option value="Yearly">Yearly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </label>
        <label>PT (Policy Term):
          <input type="number" name="pt" value={form.pt} onChange={handleChange} />
        </label>
        <label>PPT (Paying Term):
          <input type="number" name="ppt" value={form.ppt} onChange={handleChange} />
        </label>

        <button type="submit">Validate</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {tableData.length > 0 && (
        <div className="table-wrapper">
          <h3>Illustration Table</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Age</th>
                <th>Premium</th>
                <th>Sum Assured</th>
                <th>Bonus Rate</th>
                <th>Bonus Amount</th>
                <th>Total Benefit</th>
                <th>Net Cashflow</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.year}</td>
                  <td>{row.age}</td>
                  <td>₹{row.premium.toLocaleString()}</td>
                  <td>₹{row.sumAssured.toLocaleString()}</td>
                  <td>{row.bonusRate}</td>
                  <td>₹{row.bonusAmount.toLocaleString()}</td>
                  <td>₹{row.totalBenefit.toLocaleString()}</td>
                  <td>₹{row.netCashflow.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
  