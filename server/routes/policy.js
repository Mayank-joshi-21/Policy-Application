const express = require('express');
const router = express.Router();

// Sample route for testing
router.get('/sample', (req, res) => {
  res.json({
    name: 'Rahul',
    dob: '1999-12-12',
    gender: 'M',
    mobile: '9876543210',
    sumAssured: 1200000,
    modalPremium: 80000,
    premiumFrequency: 'Yearly',
    pt: 18,
    ppt: 10
  });
});

// 🎯 POST route to generate benefit illustration
router.post('/illustration', (req, res) => {
  const { dob, sumAssured, modalPremium, pt, ppt } = req.body;

  if (!dob || !sumAssured || !modalPremium || !pt || !ppt) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return new Date(ageDiff).getUTCFullYear() - 1970;
  };

  const ageNow = calculateAge(dob);
  const illustration = [];

  for (let i = 1; i <= pt; i++) {
    const age = ageNow + i;
    const premium = i <= ppt ? Number(modalPremium) : 0;

    // Bonus rate logic
    let bonusRate = 0;
    if (i <= ppt) bonusRate = 2.5 + i * 0.25;
    else if (i === pt - 1) bonusRate = 4;
    else if (i === pt) bonusRate = 25;

    bonusRate = Math.min(bonusRate, 25); // Cap it to 25%

    const bonusAmount = Math.round((bonusRate / 100) * modalPremium);
    const finalSumAssured = i === ppt ? Number(sumAssured) : 0;
    const totalBenefit = bonusAmount + finalSumAssured;
    const netCashflow = totalBenefit - premium;

    illustration.push({
      year: i,
      age,
      premium,
      sumAssured: finalSumAssured,
      bonusRate: `${bonusRate.toFixed(2)}%`,
      bonusAmount,
      totalBenefit,
      netCashflow
    });
  }

  res.json({ illustration });
});

module.exports = router;
