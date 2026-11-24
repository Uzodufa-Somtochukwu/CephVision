


import { useFormik } from "formik";
import { SignInI } from "@/types/auth";
import { SIGNINSCHEMA } from "@/schemas";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { authErrorMessage, signIn } from "@/services/auth";
import { useAuth } from "@/providers/auth-provider";
// import { useDispatch} from "react-redux";
// import { getUser } from "@/redux/slices/auth";

import { RoutePaths } from "../route-paths";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextInput from "@/elements/text-field";
import { cephLoginImage } from "@/public/images";
import Image from "next/image";

const LoginForm = () => {
  const navigate = useRouter();
//   const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Already signed in: go straight to the dashboard.
  useEffect(() => {
    if (!loading && user) navigate.replace(RoutePaths.DASHBOARD);
  }, [user, loading, navigate]);

  //initial form value
  const initialValues: SignInI = {
    email: "",
    password: "",
  };

  const { handleSubmit, handleChange, values, errors, touched } =
    useFormik<SignInI>({
      initialValues,
      validationSchema: SIGNINSCHEMA,
      onSubmit: async (formValues) => {
        setSubmitting(true);
        try {
          await signIn(formValues);
          toast.success("Welcome back!");
          navigate.replace(RoutePaths.DASHBOARD);
        } catch (err) {
          toast.error(authErrorMessage(err));
        } finally {
          setSubmitting(false);
        }
      },
    });

  return (
    <main className="w-full ">
      <div className="grid w-full gap-x-5 min-h-screen ">
        
        

        {/* right content */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 w-full flex flex-col justify-center md:h-screen"
        >
          <div className="bg-white p-4 rounded-xl border shadow-[grey] shadow-sm w-full">
          <section>
            <div className="flex flex-row gap-x-2 items-center -ml-2">
              <Image src={cephLoginImage} alt="logo"  className="rounded-full h-10 w-10"  />
              <h2 className="text-black font-bold text-2xl">
                CephVision
              </h2>
            </div>
          </section>

          
          <h1 className="text-xl font-bold mt-16 text-black ">Welcome Back!</h1>
          <section className="mt-5">
            <TextInput
              value={values.email}
              label="Email"
              onChange={handleChange}
              err={!!errors.email && touched.email}
              errMessage={errors.email}
              type="text"
              name="email"
              placeHolder="Enter email"
              className="w-full border "
            />
          </section>
          <section className="">
            <TextInput
              value={values.password}
              label="Password"
              onChange={handleChange}
              err={!!errors.password && touched.password}
              errMessage={errors.password}
              type="password"
              name="password"
              placeHolder="***********"
              className="w-full border/"
            />
          </section>
          <div className="flex flex-row justify-between text-base font-normal mt-3 mb-2  text-primary">
            <Link href={RoutePaths.FORGOTPASSWORD}>
              <h3 className="text-primary text-black underline">Forgot password?</h3>
            </Link>
            <Link href="/signup">
              <h3 className="text-primary text-black underline">Signup</h3>
            </Link>
          </div>
          <div>
            {/* <button
              type="submit"
              className={`bg-primary w-full cursor-pointer py-3 rounded-[10px] text-white font-bold ${
                signinMutation.isPending && "cursor-not-allowed"
              }`}
              disabled={signinMutation.isPending}
            >
              {signinMutation.isPending && !signinMutation.isError
                ? "Logging in..."
                : "Sign In"}
            </button> */}
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-950 w-full cursor-pointer py-3 rounded-[10px] text-white font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            
          </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default LoginForm;
