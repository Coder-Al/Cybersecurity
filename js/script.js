 // total 15 questions
  const totalQuestions = 15;

  function updateProgress() {
    let answered = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const radios = document.getElementsByName(`q${i}`);
      const isAnswered = Array.from(radios).some(r => r.checked);
      if (isAnswered) answered++;
    }
    document.getElementById('progressCount').innerText = `${answered} / ${totalQuestions} answered`;
    const percent = (answered / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${percent}%`;
  }

  // attach event listeners to all radio buttons
  function bindProgressEvents() {
    for (let i = 1; i <= totalQuestions; i++) {
      const radios = document.getElementsByName(`q${i}`);
      radios.forEach(radio => radio.addEventListener('change', updateProgress));
    }
  }

  // gather answers and generate educational + risk scoring message
  function generateResults() {
    const answers = {};
    let allAnswered = true;
    for (let i = 1; i <= totalQuestions; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        allAnswered = false;
        break;
      }
      answers[`q${i}`] = selected.value;
    }
    if (!allAnswered) {
      alert("Please answer all 15 questions before viewing your personalized cybersecurity report.");
      return null;
    }

    // risk indicators & educational feedback
    let riskPoints = [];
    let goodPoints = [];

    // Q5 knowledge check (false = correct)
    if (answers.q5 === "False") goodPoints.push("✅ You know that logos can be faked — great awareness.");
    else riskPoints.push("⚠️ Believing logos = safe is risky. Always verify sender address.");

    // Q6 backups
    if (answers.q6 === "Daily or weekly backup to offline/unconnected drive") goodPoints.push("✅ Offline backups: excellent protection against ransomware.");
    else riskPoints.push("🔴 No offline backups = high ransomware risk. Start 3-2-1 backup strategy.");

    // Q7 password
    if (answers.q7 === "Password manager (Bitwarden, 1Password etc)" || answers.q7 === "2FA on important accounts") goodPoints.push("🔐 Strong password practice + 2FA reduces account takeover risk.");
    else riskPoints.push("❌ Weak/reused passwords or written notebooks: use a password manager & enable 2FA.");

    // Q8 public Wi-Fi
    if (answers.q8 === "Company VPN always required") goodPoints.push("📡 VPN usage secures remote work.");
    else if (answers.q8 === "Sometimes use public Wi-Fi without VPN") riskPoints.push("⚠️ Public Wi-Fi without VPN exposes business data. Use a VPN immediately.");

    // Q10 verification procedure
    if (answers.q10 === "Yes, written and all staff trained") goodPoints.push("📋 Great! Written verification procedure prevents social engineering.");
    else riskPoints.push("📞 No verification procedure = vulnerable to fake CEO/supplier calls. Create 'Stop-Call-Verify' rule.");

    // Q11 updates
    if (answers.q11 === "Automatic updates enabled on all devices") goodPoints.push("🔄 Automatic updates close security holes.");
    else riskPoints.push("⏰ Delayed software updates = easy target. Enable auto-updates.");

    // Q12 attitude (if high agreement 4 or 5 -> risky mindset)
    if (answers.q12 && (answers.q12 === "4" || answers.q12 === "5")) riskPoints.push("🧠 Thinking 'too small to be targeted' is dangerous. SMEs are prime targets in The Bahamas.");
    else if (answers.q12 && answers.q12 === "1") goodPoints.push("🎯 You understand that size doesn't stop cybercriminals — strong mindset.");

    // Q13 readiness
    if (answers.q13 && (answers.q13 === "1" || answers.q13 === "2")) riskPoints.push("🚨 Unprepared for ransomware: create an incident response plan today.");
    else if (answers.q13 === "4" || answers.q13 === "5") goodPoints.push("💪 Confident in ransomware response — ensure backups match that confidence.");

    // Q14 training
    if (answers.q14 && (answers.q14 === "1" || answers.q14 === "2")) riskPoints.push("🎓 No recent cybersecurity training = higher human error risk. Request annual training.");
    else if (answers.q14 === "4" || answers.q14 === "5") goodPoints.push("📚 Regular training strengthens your human firewall.");

    // Q4 exposure (awareness benefit)
    if (answers.q4 === "Yes, several times" || answers.q4 === "Yes, once or twice") goodPoints.push("📧 You've spotted phishing attempts — stay vigilant and report them.");

    // Q9 social engineering exposure
    if (answers.q9 === "Yes, multiple times" || answers.q9 === "Yes, once") goodPoints.push("📞 Your team has encountered vishing attempts — good awareness, always verify callers.");

    const totalRisks = riskPoints.length;
    let summary = "";
    if (totalRisks === 0) summary = "🌟 Excellent! Your SME shows strong cyber hygiene. Keep training and backing up offline.";
    else if (totalRisks <= 2) summary = "👍 Moderate risks detected — address the items below to become more resilient.";
    else summary = "⚠️ Several gaps found. Take action: follow the recommendations below to protect your Bahamian business.";

    return { summary, riskPoints, goodPoints, answers };
  }

  function displayResults() {
    const res = generateResults();
    if (!res) return;
    const panel = document.getElementById('resultPanel');
    panel.style.display = 'block';
    let riskHtml = res.riskPoints.length ? `<ul class="advice-list">${res.riskPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : "<p>✨ No major red flags — maintain strong practices.</p>";
    let goodHtml = res.goodPoints.length ? `<h4>👍 What you're doing right</h4><ul class="advice-list">${res.goodPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : "";

    panel.innerHTML = `
      <h3>🇧🇸 Your Cybersecurity Snapshot</h3>
      <div class="score-badge">${res.riskPoints.length} improvement areas identified</div>
      <p><strong>${res.summary}</strong></p>
      ${goodHtml}
      <h4>🔧 Recommended Actions for Bahamas SMEs</h4>
      ${riskHtml}
      <hr>
      <p style="font-size:0.85rem; margin-top:0.75rem;">✅ Implement offline backups, enable 2FA, use a VPN on public Wi-Fi, and train staff on 'Stop-Call-Verify'.<br>
      📢 Report incidents to CERT Bahamas (cert.gov.bs) & share this quiz with other local businesses.</p>
    `;
    // scroll to results
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('submitBtn').addEventListener('click', displayResults);
  bindProgressEvents();
  updateProgress();