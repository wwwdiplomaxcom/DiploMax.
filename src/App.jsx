import React, { useState, useEffect } from 'react';

export default function App() {
  // Navigation & Auth States
  const [view, setView] = useState('home'); // 'home', 'student-login', 'student-dashboard', 'admin-login', 'admin-dashboard', 'pdf-viewer', 'test-portal'
  const [studentInfo, setStudentInfo] = useState({ name: '', branch: 'Mechanical', sem: '1st Sem', phone: '' });
  
  // Admin Login Inputs
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Active Item Viewers
  const [activePdf, setActivePdf] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  // Dynamic Storage for Admin Uploads (Persisted in localStorage)
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('diplomax_materials');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'Notes', branch: 'Mechanical', sem: '3rd Sem', title: 'Strength of Materials Unit 1 Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 2, type: 'PYQ', branch: 'Mechanical', sem: '3rd Sem', title: '2024 Mechanics PYQ Paper', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 3, type: 'Syllabus', branch: 'Computer Science', sem: '1st Sem', title: 'CS Engineering Syllabus SBTE', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ];
  });

  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('diplomax_tests');
    return saved ? JSON.parse(saved) : [
      { id: 1, branch: 'Mechanical', sem: '3rd Sem', title: 'Thermodynamics Basic Quiz', questions: [
        { q: 'First law of thermodynamics is based on?', options: ['Conservation of Energy', 'Conservation of Mass', 'Entropy', 'None'], ans: 0 }
      ]}
    ];
  });

  // Admin Upload Form States
  const [uploadType, setUploadType] = useState('Notes');
  const [upBranch, setUpBranch] = useState('Mechanical');
  const [upSem, setUpSem] = useState('1st Sem');
  const [upTitle, setUpTitle] = useState('');
  const [upUrl, setUpUrl] = useState('');

  // Test Creator States
  const [testTitle, setTestTitle] = useState('');
  const [testBranch, setTestBranch] = useState('Mechanical');
  const [testSem, setTestSem] = useState('1st Sem');
  const [questionsList, setQuestionsList] = useState([]);
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);

  useEffect(() => {
    localStorage.setItem('diplomax_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('diplomax_tests', JSON.stringify(tests));
  }, [tests]);

  // Admin Authentication Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'DiploMax824124VSK' && adminPass === 'DM824124VSK') {
      setAdminError('');
      setView('admin-dashboard');
    } else {
      setAdminError('Invalid Secret Credentials! Access Denied.');
    }
  };

  // Handle Material Upload
  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!upTitle || !upUrl) return alert('Please fill all fields');
    const newMat = { id: Date.now(), type: uploadType, branch: upBranch, sem: upSem, title: upTitle, url: upUrl };
    setMaterials([newMat, ...materials]);
    setUpTitle('');
    setUpUrl('');
    alert('Successfully Uploaded!');
  };

  // Add Question to Test Builder
  const handleAddQuestion = () => {
    if(!qText || !opt1 || !opt2) return alert('Enter question and at least 2 options');
    const newQ = { q: qText, options: [opt1, opt2, opt3, opt4].filter(Boolean), ans: parseInt(correctOpt) };
    setQuestionsList([...questionsList, newQ]);
    setQText(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('');
  };

  // Save Test
  const handleSaveTest = () => {
    if(!testTitle || questionsList.length === 0) return alert('Add title and at least one question');
    const newTest = { id: Date.now(), branch: testBranch, sem: testSem, title: testTitle, questions: questionsList };
    setTests([newTest, ...tests]);
    setTestTitle(''); setQuestionsList([]);
    alert('Test Created Successfully!');
  };

  // Evaluate Test Score
  const submitTest = (testObj) => {
    let score = 0;
    testObj.questions.forEach((q, idx) => {
      if(testAnswers[idx] === q.ans) score++;
    });
    setTestResult({ score, total: testObj.questions.length });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-lg">DM</div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">DiploMax</h1>
            <p className="text-xs text-blue-400">Polytechnic Wallah Partner</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {view !== 'home' && (
            <button onClick={() => setView('home')} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition">Home</button>
          )}
          <button onClick={() => setView('admin-login')} className="bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition">Admin Panel</button>
        </div>
      </nav>

      {/* 1. HOME VIEW */}
      {view === 'home' && (
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20">Official Diploma Learning Portal</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight">Free Unit-Wise Notes, PYQ & Mock Tests for <span className="text-blue-500">Polytechnic Students</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">Access semester notes, previous year questions, syllabus, important questions and online tests with 1-click access.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setView('student-login')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5">Student Portal 🚀</button>
            <button onClick={() => setView('admin-login')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-3.5 rounded-xl font-bold transition">Admin Login 🔒</button>
          </div>
        </div>
      )}

      {/* 2. STUDENT LOGIN */}
      {view === 'student-login' && (
        <div className="max-w-md mx-auto mt-12 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Student Quick Login</h3>
          <p className="text-slate-400 text-sm mb-6">Select your branch & semester to access study resources instantly.</p>
          <form onSubmit={(e) => { e.preventDefault(); if(!studentInfo.name) return alert('Please enter your name'); setView('student-dashboard'); }} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Your Full Name</label>
              <input type="text" required value={studentInfo.name} onChange={(e)=>setStudentInfo({...studentInfo, name: e.target.value})} placeholder="e.g. Rahul Kumar" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select Branch</label>
              <select value={studentInfo.branch} onChange={(e)=>setStudentInfo({...studentInfo, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none">
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Computer Science">Computer Science & Engg</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Electrical">Electrical Engineering</option>
                <option value="Electronics">Electronics Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select Semester</label>
              <select value={studentInfo.sem} onChange={(e)=>setStudentInfo({...studentInfo, sem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none">
                <option value="1st Sem">1st Semester</option>
                <option value="2nd Sem">2nd Semester</option>
                <option value="3rd Sem">3rd Semester</option>
                <option value="4th Sem">4th Semester</option>
                <option value="5th Sem">5th Semester</option>
                <option value="6th Sem">6th Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">WhatsApp / Phone Number (Optional)</label>
              <input type="tel" value={studentInfo.phone} onChange={(e)=>setStudentInfo({...studentInfo, phone: e.target.value})} placeholder="9876543210" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/30 mt-2">Continue to Dashboard</button>
          </form>
        </div>
      )}

      {/* 3. STUDENT DASHBOARD */}
      {view === 'student-dashboard' && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-blue-900/40 to-slate-800 border border-blue-500/30 p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs bg-blue-500 text-white font-semibold px-2.5 py-1 rounded-md">Welcome, {studentInfo.name} 👋</span>
              <h2 className="text-2xl font-bold mt-2">{studentInfo.branch} — {studentInfo.sem}</h2>
            </div>
            <button onClick={() => setView('student-login')} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg">Change Branch/Sem</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Notes, PYQ, Syllabus list */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📚 Study Material & Notes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {materials.filter(m => m.branch === studentInfo.branch && m.sem === studentInfo.sem).length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No materials uploaded yet for your branch & semester. Admin will upload soon!</p>
                ) : (
                  materials.filter(m => m.branch === studentInfo.branch && m.sem === studentInfo.sem).map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/50 transition">
                      <div>
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">{item.type}</span>
                        <h4 className="font-semibold text-sm mt-1">{item.title}</h4>
                      </div>
                      <a href={item.url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1">Open PDF ↗</a>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Online Tests Section */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">✍️ Unit-Wise Mock Tests</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {tests.filter(t => t.branch === studentInfo.branch && t.sem === studentInfo.sem).length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No tests available for your branch & semester right now.</p>
                ) : (
                  tests.filter(t => t.branch === studentInfo.branch && t.sem === studentInfo.sem).map(test => (
                    <div key={test.id} className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">MCQ Quiz</span>
                        <h4 className="font-semibold text-sm mt-1">{test.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{test.questions.length} Questions</p>
                      </div>
                      <button onClick={() => { setActiveTest(test); setTestAnswers({}); setTestResult(null); setView('test-portal'); }} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition">Start Test</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN LOGIN */}
      {view === 'admin-login' && (
        <div className="max-w-md mx-auto mt-12 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Admin Secure Portal</h3>
          <p className="text-slate-400 text-sm mb-6">Enter secret admin credentials to manage files and tests.</p>
          {adminError && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-xs mb-4">{adminError}</div>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Admin Username</label>
              <input type="text" required value={adminUser} onChange={(e)=>setAdminUser(e.target.value)} placeholder="DiploMax824124VSK" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Secret Password</label>
              <input type="password" required value={adminPass} onChange={(e)=>setAdminPass(e.target.value)} placeholder="••••••••••••" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 py-3.5 rounded-xl font-bold transition shadow-lg shadow-red-600/30 mt-2">Login as Admin</button>
          </form>
        </div>
      )}

      {/* 5. ADMIN DASHBOARD */}
      {view === 'admin-dashboard' && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-red-600/10 border border-red-500/30 p-6 rounded-2xl mb-8 flex justify-between items-center">
            <div>
              <span className="text-xs bg-red-500 text-white font-semibold px-2.5 py-1 rounded-md">Admin Mode Active 🔐</span>
              <h2 className="text-2xl font-bold mt-2">DiploMax Management Console</h2>
            </div>
            <button onClick={() => setView('home')} className="bg-slate-700 hover:bg-slate-600 text-xs px-4 py-2 rounded-lg font-semibold">Logout Admin</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Files/Notes */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">📤 Upload Notes / PYQ / Syllabus</h3>
              <form onSubmit={handleUploadMaterial} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category Type</label>
                  <select value={uploadType} onChange={(e)=>setUploadType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                    <option value="Notes">Unit-Wise Notes</option>
                    <option value="PYQ">Previous Year Questions (PYQ)</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Important Q&A">Important Questions & Answer</option>
                    <option value="Video">Video Link</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Branch</label>
                    <select value={upBranch} onChange={(e)=>setUpBranch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                      <option value="Mechanical">Mechanical</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Civil">Civil</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Semester</label>
                    <select value={upSem} onChange={(e)=>setUpSem(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                      <option value="1st Sem">1st Sem</option>
                      <option value="2nd Sem">2nd Sem</option>
                      <option value="3rd Sem">3rd Sem</option>
                      <option value="4th Sem">4th Sem</option>
                      <option value="5th Sem">5th Sem</option>
                      <option value="6th Sem">6th Sem</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Title / Subject Name</label>
                  <input type="text" required value={upTitle} onChange={(e)=>setUpTitle(e.target.value)} placeholder="e.g. Thermodynamics Unit 1 Notes" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">File URL (Google Drive / PDF link)</label>
                  <input type="url" required value={upUrl} onChange={(e)=>setUpUrl(e.target.value)} placeholder="https://example.com/file.pdf" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-sm transition">Upload Content Now</button>
              </form>
            </div>

            {/* Create Test Section */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">✍️ Create Online Test / MCQ Quiz</h3>
              <div className="space-y-3">
                <input type="text" value={testTitle} onChange={(e)=>setTestTitle(e.target.value)} placeholder="Test Title (e.g. Unit 1 Quiz)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"/>
                <div className="grid grid-cols-2 gap-2">
                  <select value={testBranch} onChange={(e)=>setTestBranch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                    <option value="Mechanical">Mechanical</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                  <select value={testSem} onChange={(e)=>setTestSem(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                    <option value="1st Sem">1st Sem</option>
                    <option value="3rd Sem">3rd Sem</option>
                    <option value="5th Sem">5th Sem</option>
                  </select>
                </div>
                <hr className="border-slate-700 my-2"/>
                <input type="text" value={qText} onChange={(e)=>setQText(e.target.value)} placeholder="Question statement..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"/>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={opt1} onChange={(e)=>setOpt1(e.target.value)} placeholder="Option A" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"/>
                  <input type="text" value={opt2} onChange={(e)=>setOpt2(e.target.value)} placeholder="Option B" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"/>
                  <input type="text" value={opt3} onChange={(e)=>setOpt3(e.target.value)} placeholder="Option C" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"/>
                  <input type="text" value={opt4} onChange={(e)=>setOpt4(e.target.value)} placeholder="Option D" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"/>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Correct Option Index (0 to 3):</span>
                  <input type="number" min="0" max="3" value={correctOpt} onChange={(e)=>setCorrectOpt(e.target.value)} className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center text-sm"/>
                </div>
                <button type="button" onClick={handleAddQuestion} className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-xs font-bold">➕ Add Question ({questionsList.length} Added)</button>
                <button type="button" onClick={handleSaveTest} className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl font-bold text-sm transition">Publish Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TEST TAKING PORTAL */}
      {view === 'test-portal' && activeTest && (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button onClick={() => setView('student-dashboard')} className="text-xs text-blue-400 mb-4 hover:underline">← Back to Dashboard</button>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-1">{activeTest.title}</h2>
            <p className="text-xs text-slate-400 mb-6">Branch: {activeTest.branch} | Semester: {activeTest.sem}</p>

            {testResult ? (
              <div className="text-center py-8 bg-slate-900 rounded-xl border border-slate-700">
                <h3 className="text-3xl font-extrabold text-blue-400 mb-2">🎉 Test Completed!</h3>
                <p className="text-lg text-slate-200">Your Score: <span className="font-bold text-green-400">{testResult.score} / {testResult.total}</span></p>
                <button onClick={() => setView('student-dashboard')} className="mt-6 bg-blue-600 px-6 py-2.5 rounded-xl text-sm font-bold">Return to Dashboard</button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTest.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-900 p-4 rounded-xl border border-slate-700/60">
                    <p className="font-semibold text-sm mb-3">Q{qIdx+1}. {q.q}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer text-xs transition ${testAnswers[qIdx] === optIdx ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          <input type="radio" name={`question-${qIdx}`} checked={testAnswers[qIdx] === optIdx} onChange={() => setTestAnswers({...testAnswers, [qIdx]: optIdx})} className="accent-blue-500"/>
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => submitTest(activeTest)} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 transition">Submit Test & View Automated Result</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
