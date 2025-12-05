import { useState } from 'react'
import './App.css'

function App() {
  // Exam scores
  const [finalExam, setFinalExam] = useState('')
  const [midterm1, setMidterm1] = useState('')
  const [midterm2, setMidterm2] = useState('')
  const [hasTakenFinal, setHasTakenFinal] = useState(false)

  // Project toggle and scores
  const [useDetailedProject, setUseDetailedProject] = useState(true)
  const [projectTotal, setProjectTotal] = useState('')
  const [sdd, setSdd] = useState('')
  const [crc, setCrc] = useState('')
  const [protocols, setProtocols] = useState('')
  const [implementation, setImplementation] = useState('')
  const [demos, setDemos] = useState('')

  // Homework and quizzes
  const [homeworkInput, setHomeworkInput] = useState('')

  // Validation helper for inputs
  const handleScoreInput = (value) => {
    if (value === '') return ''
    const num = parseFloat(value)
    if (isNaN(num)) return ''
    if (num < 0) return '0'
    if (num > 100) return '100'
    return value
  }

  // Validation helper for calculations
  const validateScore = (value) => {
    if (value === '') return ''
    const num = parseFloat(value)
    if (isNaN(num)) return ''
    return Math.min(Math.max(num, 0), 100)
  }

  // Parse comma-separated homework scores
  const calculateHomeworkAverage = () => {
    if (!homeworkInput.trim()) return 0
    const scores = homeworkInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n))
      .map(n => Math.min(Math.max(n, 0), 100))
    
    if (scores.length === 0) return 0
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }

  // Calculate final grade
  const calculateGrade = () => {
    let total = 0

    // Calculate final exam score (average of midterms if not taken yet)
    let finalScore = finalExam
    if (!hasTakenFinal && midterm1 !== '' && midterm2 !== '') {
      const avg = (validateScore(midterm1) + validateScore(midterm2)) / 2
      finalScore = avg.toString()
    }

    // Exams
    if (finalScore !== '') {
      total += validateScore(finalScore) * 0.18
    }
    if (midterm1 !== '') {
      total += validateScore(midterm1) * 0.135
    }
    if (midterm2 !== '') {
      total += validateScore(midterm2) * 0.135
    }

    // Project
    if (useDetailedProject) {
      if (sdd !== '') {
        total += validateScore(sdd) * 0.09
      }
      if (crc !== '') {
        total += validateScore(crc) * 0.045
      }
      if (protocols !== '') {
        total += validateScore(protocols) * 0.0225
      }
      if (implementation !== '') {
        total += validateScore(implementation) * 0.18
      }
      if (demos !== '') {
        total += validateScore(demos) * 0.1125
      }
    } else {
      if (projectTotal !== '') {
        total += validateScore(projectTotal) * 0.45
      }
    }

    // Homework
    if (homeworkInput.trim()) {
      const hwAvg = calculateHomeworkAverage()
      total += hwAvg * 0.10
    }

    return total
  }

  const finalGrade = calculateGrade()

  // Heat map function
  const getHeatMapStatus = (grade) => {
    if (grade === 0) return { level: -2, text: "Enter your grades to see how cooked you are!", color: '#666', emoji: '🤔' }
    if (grade >= 95) return { level: 5, text: "🔥 Absolute Legend! You're cooking with gas!", color: '#00ff00', emoji: '😎' }
    if (grade >= 90) return { level: 4, text: "💪 Crushing It! Keep this up!", color: '#7fff00', emoji: '😄' }
    if (grade >= 85) return { level: 3, text: "👍 Looking Good! Solid work!", color: '#ffff00', emoji: '🙂' }
    if (grade >= 80) return { level: 2, text: "📚 Hanging In There... Study more!", color: '#ffa500', emoji: '😐' }
    if (grade >= 70) return { level: 1, text: "⚠️ Getting Toasty... Time to hit the books!", color: '#ff6600', emoji: '😬' }
    if (grade >= 60) return { level: 0, text: "🔥 Medium Rare... Danger zone!", color: '#ff3300', emoji: '😰' }
    return { level: -1, text: "💀 Burnt to a Crisp! SOS!", color: '#ff0000', emoji: '💀' }
  }

  const heatStatus = getHeatMapStatus(finalGrade)

  return (
    <div className="app">
      <div className="container">
        <h1>🍳 The Food Critic</h1>
        <p className="subtitle">How cooked am I?</p>

        {/* Exams Section */}
        <div className="section">
          <h2>📝 Exams</h2>
          <div className="toggle-container">
            <label className="toggle">
              <input
                type="checkbox"
                checked={hasTakenFinal}
                onChange={(e) => setHasTakenFinal(e.target.checked)}
              />
              <span>I will take the final exam</span>
            </label>
          </div>
          <div className="input-group">
            <label>
              Midterm 1 (13.5%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={midterm1}
                onChange={(e) => setMidterm1(handleScoreInput(e.target.value))}
                placeholder="0-100"
              />
            </label>
            <label>
              Midterm 2 (13.5%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={midterm2}
                onChange={(e) => setMidterm2(handleScoreInput(e.target.value))}
                placeholder="0-100"
              />
            </label>
            <label>
              Final Exam (18%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={hasTakenFinal ? finalExam : (midterm1 !== '' && midterm2 !== '' ? ((validateScore(midterm1) + validateScore(midterm2)) / 2).toFixed(2) : '')}
                onChange={(e) => setFinalExam(handleScoreInput(e.target.value))}
                placeholder={hasTakenFinal ? "0-100" : "Average of midterms"}
                disabled={!hasTakenFinal}
                style={{ opacity: hasTakenFinal ? 1 : 0.6 }}
              />
            </label>
          </div>
        </div>

        {/* Project Section */}
        <div className="section">
          <h2>💼 Project (45% total)</h2>
          <div className="toggle-container">
            <label className="toggle">
              <input
                type="checkbox"
                checked={useDetailedProject}
                onChange={(e) => setUseDetailedProject(e.target.checked)}
              />
              <span>Use detailed breakdown or estimated total fro project</span>
            </label>
          </div>

          {useDetailedProject ? (
            <div className="input-group">
              <label>
                SDD (9%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={sdd}
                  onChange={(e) => setSdd(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
              <label>
                CRC (4.5%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={crc}
                  onChange={(e) => setCrc(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
              <label>
                Protocols (2.25%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={protocols}
                  onChange={(e) => setProtocols(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
              <label>
                Implementation (18%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={implementation}
                  onChange={(e) => setImplementation(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
              <label>
                Demos (11.25%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={demos}
                  onChange={(e) => setDemos(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
            </div>
          ) : (
            <div className="input-group">
              <label>
                Total Project Grade (45%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={projectTotal}
                  onChange={(e) => setProjectTotal(handleScoreInput(e.target.value))}
                  placeholder="0-100"
                />
              </label>
            </div>
          )}
        </div>

        {/* Homework Section */}
        <div className="section">
          <h2>📚 Homework & Quizzes (10%)</h2>
          <div className="input-group">
            <label>
              Scores (comma-separated)
              <input
                type="text"
                value={homeworkInput}
                onChange={(e) => setHomeworkInput(e.target.value)}
                placeholder="85, 90, 78, 92"
              />
              {homeworkInput.trim() && (
                <small>Average: {calculateHomeworkAverage().toFixed(2)}%</small>
              )}
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="results">
          <div className="grade-display">
            <h2>Current Grade</h2>
            <div className="grade-number">{finalGrade.toFixed(2)}%</div>
          </div>

          {/* Heat Map */}
          <div className="heat-map">
            <h3>How Cooked Am I? {heatStatus.emoji}</h3>
            <div className="thermometer">
              <div 
                className="thermometer-fill"
                style={{
                  height: `${Math.min(finalGrade, 100)}%`,
                  backgroundColor: heatStatus.color
                }}
              ></div>
            </div>
            <p className="status-text" style={{ color: heatStatus.color }}>
              {heatStatus.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
