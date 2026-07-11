// Import necessary hooks from React Hook Form
import { useForm } from "react-hook-form";
import { useState } from "react";

const ReactFormHook = () => {
  // State to store and display submitted form data
  const [submittedData, setSubmittedData] = useState(null);
  
  // Destructure all useful methods and properties from useForm()
  const {
    register,        // Connects input fields to form validation
    handleSubmit,    // Handles form submission with validation
    formState: { errors, isSubmitting }, // Form state: validation errors & submission status
    reset,          // Resets entire form to initial values
    watch,          // Watches specific field values in real-time
    setValue,       // Programmatically sets field values
    getValues,      // Gets current form values
    trigger         // Manually triggers validation
  } = useForm({
    defaultValues: {  // Optional: Set initial values for form fields
      fullName: "",
      email: "",
      interests: [],
      experience: 5
    },
    mode: "onChange"  // Validate on change (options: onSubmit, onBlur, onChange, onTouched)
  });
  
  // Watch specific fields for real-time validation & UI updates
  const watchPassword = watch("password"); // Tracks password field value
  const watchExperience = watch("experience"); // Tracks experience slider value
  const watchBio = watch("bio"); // Tracks bio character count
  
  // Form submission handler
  const onSubmit = async (data) => {
    // Simulate API call (replace with actual API call in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store submitted data to display on screen
    setSubmittedData(data);
    
    // Log to console for debugging
    console.log("Form Data Submitted:", data);
    
    // Optional: Uncomment below line to reset form after successful submission
    // reset();
  };
  
  // Error handler - called when validation fails
  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    // You can add toast notifications here
    // Example: toast.error("Please fix validation errors");
  };
  
  return (
    <>
      <h1>React Hook Forms</h1>
      
      {/* Form starts here - handleSubmit prevents default form submission */}
      <form onSubmit={handleSubmit(onSubmit, onError)} style={styles.form}>
        
        {/* ========== 1. TEXT INPUT with Validations ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Full Name *</label>
          <input
            {...register("fullName", {
              required: "⚠️ Full name is required", // Custom error message
              minLength: {
                value: 3,
                message: "⚠️ Full name must be at least 3 characters"
              },
              maxLength: {
                value: 50,
                message: "⚠️ Full name cannot exceed 50 characters"
              },
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "⚠️ Only letters and spaces allowed"
              }
            })}
            style={styles.input}
            placeholder="Enter your full name"
            aria-invalid={errors.fullName ? "true" : "false"} // Accessibility
          />
          {/* Conditional error message display */}
          {errors.fullName && <span style={styles.error}>{errors.fullName.message}</span>}
        </div>
        
        {/* ========== 2. EMAIL INPUT with Regex Validation ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Email Address *</label>
          <input
            {...register("email", {
              required: "⚠️ Email address is required",
              pattern: {
                // Standard email regex pattern
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "⚠️ Please enter a valid email (e.g., name@example.com)"
              },
              validate: {
                // Custom validation - block specific domains
                notGmail: (value) => {
                  return !value?.endsWith('gmail.com') || "⚠️ Gmail addresses not allowed for business accounts";
                },
                notTempMail: (value) => {
                  return !value?.includes('tempmail') || "⚠️ Temporary email addresses are not allowed";
                }
              }
            })}
            style={styles.input}
            placeholder="you@example.com"
          />
          {errors.email && <span style={styles.error}>{errors.email.message}</span>}
        </div>
        
        {/* ========== 3. PASSWORD with Strength Validation ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Password *</label>
          <input
            type="password"
            {...register("password", {
              required: "⚠️ Password is required",
              minLength: {
                value: 8,
                message: "⚠️ Password must be at least 8 characters"
              },
              maxLength: {
                value: 20,
                message: "⚠️ Password cannot exceed 20 characters"
              },
              pattern: {
                // Must contain at least one letter, one number, and one special character
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
                message: "⚠️ Password must contain at least one letter, one number, and one special character"
              },
              validate: {
                noCommonPasswords: (value) => {
                  const commonPasswords = ['password123', 'admin123', '12345678'];
                  return !commonPasswords.includes(value.toLowerCase()) || 
                         "⚠️ Password is too common, please choose a stronger password";
                }
              }
            })}
            style={styles.input}
            placeholder="Create a strong password"
          />
          {errors.password && <span style={styles.error}>{errors.password.message}</span>}
        </div>
        
        {/* ========== 4. CONFIRM PASSWORD with Cross-Field Validation ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Confirm Password *</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "⚠️ Please confirm your password",
              // Custom validate function compares with watched password value
              validate: (value) => 
                value === watchPassword || "⚠️ Passwords do not match. Please re-enter."
            })}
            style={styles.input}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword.message}</span>}
        </div>
        
        {/* ========== 5. NUMBER INPUT with Min/Max ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Age</label>
          <input
            type="number"
            {...register("age", {
              required: "⚠️ Age is required for verification",
              min: {
                value: 18,
                message: "⚠️ You must be at least 18 years old"
              },
              max: {
                value: 100,
                message: "⚠️ Age must be 100 or less"
              },
              valueAsNumber: true, // Automatically converts value to number type
              setValueAs: (v) => v === "" ? undefined : parseInt(v, 10) // Handle empty string
            })}
            style={styles.input}
            placeholder="18-100"
          />
          {errors.age && <span style={styles.error}>{errors.age.message}</span>}
          <span style={styles.helper}>Age must be between 18 and 100</span>
        </div>
        
        {/* ========== 6. SELECT DROPDOWN with Options ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Country *</label>
          <select
            {...register("country", { 
              required: "⚠️ Please select your country"
            })}
            style={styles.select}
          >
            <option value="">-- Select a country --</option>
            <option value="USA">🇺🇸 United States</option>
            <option value="UK">🇬🇧 United Kingdom</option>
            <option value="Canada">🇨🇦 Canada</option>
            <option value="Australia">🇦🇺 Australia</option>
            <option value="India">🇮🇳 India</option>
            <option value="Germany">🇩🇪 Germany</option>
            <option value="France">🇫🇷 France</option>
            <option value="Japan">🇯🇵 Japan</option>
          </select>
          {errors.country && <span style={styles.error}>{errors.country.message}</span>}
        </div>
        
        {/* ========== 7. RADIO BUTTONS with Options ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Gender *</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="male"
                {...register("gender", { 
                  required: "⚠️ Please select your gender"
                })}
              />
              👨 Male
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="female"
                {...register("gender", { required: "⚠️ Please select your gender" })}
              />
              👩 Female
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="prefer-not-to-say"
                {...register("gender", { required: "⚠️ Please select your gender" })}
              />
              🤐 Prefer not to say
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="other"
                {...register("gender", { required: "⚠️ Please select your gender" })}
              />
              🌈 Other
            </label>
          </div>
          {errors.gender && <span style={styles.error}>{errors.gender.message}</span>}
        </div>
        
        {/* ========== 8. CHECKBOX GROUP (Multiple Selection) ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Skills & Interests (Select all that apply)</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="react"
                {...register("skills")}
              />
              ⚛️ React
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="nodejs"
                {...register("skills")}
              />
              🟢 Node.js
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="python"
                {...register("skills")}
              />
              🐍 Python
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="javascript"
                {...register("skills")}
              />
              📜 JavaScript
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="uiux"
                {...register("skills")}
              />
              🎨 UI/UX Design
            </label>
          </div>
          <span style={styles.helper}>Select at least one skill</span>
        </div>
        
        {/* ========== 9. RANGE SLIDER with Real-time Value Display ========== */}
        <div style={styles.field}>
          <label style={styles.label}>
            Experience Level: {watchExperience || 5}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            {...register("experience", { 
              valueAsNumber: true,
              required: "⚠️ Please rate your experience level"
            })}
            style={styles.range}
          />
          <div style={styles.rangeLabels}>
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Expert</span>
          </div>
        </div>
        
        {/* ========== 10. TEXTAREA with Character Counter ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Bio / About You</label>
          <textarea
            {...register("bio", {
              maxLength: {
                value: 200,
                message: "⚠️ Bio cannot exceed 200 characters"
              },
              minLength: {
                value: 10,
                message: "⚠️ Please write at least 10 characters"
              }
            })}
            style={styles.textarea}
            rows="4"
            placeholder="Tell us about yourself, your experience, and what brings you here..."
          />
          {errors.bio && <span style={styles.error}>{errors.bio.message}</span>}
          {/* Real-time character counter */}
          <span style={styles.charCount}>
            {watchBio?.length || 0} / 200 characters used
          </span>
        </div>
        
        {/* ========== 11. DATE INPUT with Future Date Validation ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            {...register("dob", {
              validate: {
                notFuture: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  return selectedDate <= today || "⚠️ Date of birth cannot be in the future";
                },
                minAge: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - selectedDate.getFullYear();
                  return age >= 18 || "⚠️ You must be at least 18 years old";
                }
              }
            })}
            style={styles.input}
          />
          {errors.dob && <span style={styles.error}>{errors.dob.message}</span>}
        </div>
        
        {/* ========== 12. FILE UPLOAD with Validation ========== */}
        <div style={styles.field}>
          <label style={styles.label}>Profile Picture</label>
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            {...register("profilePicture", {
              validate: {
                fileSize: (files) => {
                  if (!files || files.length === 0) return true;
                  const file = files[0];
                  const maxSize = 2 * 1024 * 1024; // 2MB
                  return file.size <= maxSize || "⚠️ File size must be less than 2MB";
                },
                fileType: (files) => {
                  if (!files || files.length === 0) return true;
                  const file = files[0];
                  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                  return validTypes.includes(file.type) || "⚠️ Only JPG, JPEG, and PNG files are allowed";
                }
              }
            })}
            style={styles.input}
          />
          {errors.profilePicture && <span style={styles.error}>{errors.profilePicture.message}</span>}
          <span style={styles.helper}>Max 2MB. Allowed: JPG, JPEG, PNG</span>
        </div>
        
        {/* ========== 13. CHECKBOX (Terms & Conditions) ========== */}
        <div style={styles.field}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register("terms", { 
                required: "⚠️ You must accept the Terms & Conditions to proceed"
              })}
            />
            I have read and agree to the <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong> *
          </label>
          {errors.terms && <span style={styles.error}>{errors.terms.message}</span>}
        </div>
        
        {/* ========== 14. NEWSLETTER SUBSCRIPTION (Optional) ========== */}
        <div style={styles.field}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register("newsletter")}
            />
            Subscribe me to monthly newsletter (optional)
          </label>
        </div>
        
        {/* ========== FORM BUTTONS ========== */}
        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? "⏳ Submitting..." : "✅ Submit Form"}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              // Reset form to default values
              reset();
              // Clear submitted data display
              setSubmittedData(null);
            }}
            style={styles.resetButton}
          >
            🔄 Reset Form
          </button>
          
          {/* Optional: Button to manually trigger validation */}
          <button
            type="button"
            onClick={() => trigger()}
            style={styles.validateButton}
          >
            ✓ Validate All Fields
          </button>
        </div>
      </form>
      
      {/* ========== DISPLAY SUBMITTED DATA ========== */}
      {submittedData && (
        <div style={styles.submittedData}>
          <h3>✅ Form Submitted Successfully!</h3>
          <h4>Submitted Data:</h4>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          {/* Button to copy JSON to clipboard */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(submittedData, null, 2));
              alert("Data copied to clipboard!");
            }}
            style={styles.copyButton}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}
    </>
  );
};

// ========== STYLES (Minimal CSS using inline styles) ==========
const styles = {
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  field: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.3s"
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    resize: "vertical"
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    marginTop: "5px",
    flexWrap: "wrap"
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px"
  },
  checkboxGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "5px",
    flexWrap: "wrap"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px"
  },
  range: {
    width: "100%",
    marginTop: "5px",
    cursor: "pointer"
  },
  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
    fontSize: "12px",
    color: "#666"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    flex: 1,
    transition: "background-color 0.3s"
  },
  resetButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1
  },
  validateButton: {
    backgroundColor: "#17a2b8",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1
  },
  copyButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px"
  },
  error: {
    color: "#dc3545",
    fontSize: "12px",
    display: "block",
    marginTop: "5px",
    fontWeight: "500"
  },
  helper: {
    fontSize: "12px",
    color: "#6c757d",
    display: "block",
    marginTop: "5px"
  },
  charCount: {
    fontSize: "12px",
    color: "#6c757d",
    display: "block",
    marginTop: "5px",
    textAlign: "right"
  },
  submittedData: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    borderRadius: "4px",
    overflow: "auto"
  }
};

export default ReactFormHook;

// const ReactFormHook = () => {
//     return (
//         <>
//            <h1>React Hook Form</h1>
//         </>
//     )
// }

// export default ReactFormHook

