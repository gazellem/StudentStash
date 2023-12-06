import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Student Stash - Login Page</title>
        <style>
          {`
            body {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
              padding: 20px;
              justify-content: center;
            }

            .parent-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              align-items: start;
              gap: 20px;
            }

            #firstColumn, #secondColumn {
              display: grid;
              grid-template-columns: 1fr;
            }

            #secondColumn label, #secondColumn input {
              margin-bottom: 10px;
            }

            .btn {
              display: block;
              padding: 1rem;
              margin-left: 7rem;
              margin-right: 7rem;
            }

            #emailInput, #passwordInput {
              padding: 1rem;
            }
          `}
        </style>
      </head>
      <body>
        <div className="parent-container">
          <div id="firstColumn">
            <h2>Login Page</h2>
          </div>
          <div id="secondColumn">
            <label htmlFor="emailInput"> Enter Email </label>
            <input type="text" id="emailInput" />

            <label htmlFor="passwordInput"> Enter Password </label>
            <input type="text" id="passwordInput" />

            <button type="button" id="login-button" className="btn">
              Log In
            </button>

            <h4>Don't have an account?</h4>
            <a href="signup.html"> Sign Up</a>
            <h4> instead.</h4>
          </div>
        </div>
        <script src="login.js"></script>
      </body>
    </html>
  );
}

export default App;
