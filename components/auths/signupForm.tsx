


import { useFormik } from "formik";
import { SignInI, SignUpI } from "@/types/auth";
import { SIGNINSCHEMA } from "@/schemas";
import { useSignIn } from "@/services/auth"; 
import { toast } from "react-toastify";
import { storeCookie } from "@/utils/storage";
// import { useDispatch} from "react-redux";
// import { getUser } from "@/redux/slices/auth";

import { RoutePaths } from "../route-paths";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextInput from "@/elements/text-field";
import { cephLoginImage } from "@/public/images";
import Image from "next/image";

const SignupForm = () => {
  const navigate = useRouter();
//   const dispatch = useDispatch();
  const signinMutation = useSignIn();

  //initial form value
  const initialValues: SignUpI = {
    username:"",
    email: "",
    password: "",
  };

  const { handleSubmit, handleChange, values, errors, touched } =
    useFormik<SignUpI>({
      initialValues,
      validationSchema: SIGNINSCHEMA,
      onSubmit: () => {
        // signinMutation.mutate(values, {
        //   onSuccess: (data) => {
        //     toast.success(data.message);
        //     navigate.push(RoutePaths.DASHBOARD);
        //     storeCookie({ key: "AUTH_TOKEN", value: data.token });
        //     dispatch(getUser(data.user)); 
        //   },
        //   onError: (error) => {
        //     toast.error(error.message);
        //   },
        // });
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
              <h2 className="text-primary font-bold text-2xl">
                CephVision
              </h2>
            </div>
          </section>

          
          {/* <h1 className="text-xl font-bold mt-16 ">Register for an awesome experience </h1> */}
          <section className="mt-7">
            <TextInput
              value={values.username}
              label="Username"
              onChange={handleChange}
              err={!!errors.username && touched.username}
              errMessage={errors.username}
              type="text"
              name="username"
              placeHolder="Enter username"
              className="w-full border "
            />
          </section>
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
            <Link href="/forgot-password">
              <h3 className="text-primary underline">Forgot password?</h3>
            </Link>
            <Link href="/login">
              <h3 className="text-primary underline">Login</h3>
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
            <button className={`bg-green-950 w-full cursor-pointer py-3 rounded-[10px] text-white font-bold `}>
                SignUp
            </button>
            
          </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default SignupForm;
