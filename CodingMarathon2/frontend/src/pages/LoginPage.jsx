import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const { emailInput, passwordInput, handleLogin } = useLogin();

  const submitForm = (e) => {
    e.preventDefault();
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label
                htmlFor="contact_email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                {...emailInput}
                id="contact_email"
                name="contact_email"
                className="border rounded w-full py-2 px-3"
                placeholder="User name or Email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                {...passwordInput}
                id="password"
                name="password"
                className="border rounded w-full py-2 px-3"
                placeholder="Type your password"
              />
            </div>

            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={handleLogin}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
