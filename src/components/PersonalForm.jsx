import React, { useState } from 'react'

// Simple email regex for demo purposes
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitsOnly = /^\d+$/

function validate(values){
  const errors = {}
  if(!values.name || values.name.trim() === ''){
    errors.name = 'Name is required.'
  } else if(values.name.trim().length < 2){
    errors.name = 'Name must be at least 2 characters.'
  }

  if(!values.password) {
    errors.password = 'Password is required.'
  } else if(values.password.length < 6){
    errors.password = 'Password must be at least 6 characters.'
  } else if(!/[0-9]/.test(values.password)){
    errors.password = 'Password must include at least one digit.'
  }

  if(!values.email) {
    errors.email = 'Email is required.'
  } else if(!emailRegex.test(values.email)){
    errors.email = 'Email looks invalid.'
  }

  if(!values.phone){
    errors.phone = 'Phone is required.'
  } else if(!digitsOnly.test(values.phone)){
    errors.phone = 'Phone must contain digits only.'
  } else if(values.phone.length < 10 || values.phone.length > 15){
    errors.phone = 'Phone must be between 10 and 15 digits.'
  }

  return errors
}

 
function fakeSave(values){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
       
      if(values.name && values.name.toLowerCase() === 'error'){
        reject(new Error('Server rejected the name value.'))
      } else {
        resolve({ status: 'ok', data: values })
      }
    }, 1200)
  })
}

export default function PersonalForm(){
  const [values, setValues] = useState({ name: '', password: '', email: '', phone: '' })
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
 
    setErrors(prevErrors => {
      const nextValues = { ...values, [name]: value }
      const nextErrors = validate(nextValues)
      return { ...prevErrors, [name]: nextErrors[name] }
    })
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name:true, password:true, email:true, phone:true })

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if(Object.keys(nextErrors).length > 0){
      setMessage({ type: 'error', text: 'Please fix the errors before saving.' })
      return
    }

    setLoading(true)
    setMessage(null)

    fakeSave(values)
      .then(res => {
        setMessage({ type: 'success', text: 'Saved successfully!' })
        
      })
      .catch(err => {
        setMessage({ type: 'error', text: err.message || 'Save failed.' })
      })
      .finally(() => setLoading(false))
  }

  const isValid = Object.keys(validate(values)).length === 0

  return (
    <form className="personal-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your full name"
        />
        {touched.name && errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="At least 6 chars and a digit"
        />
        {touched.password && errors.password && <div className="error">{errors.password}</div>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
        />
        {touched.email && errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Digits only, 10-15 chars"
        />
        {touched.phone && errors.phone && <div className="error">{errors.phone}</div>}
      </div>

      <div className="actions">
        <button type="submit" disabled={loading || !isValid}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      
        
    </form>
  )
}
