import { useFormik } from "formik";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { ForgotPasswordI } from "@/types/auth";
import { FORGOTPASSWORDSCHEMA } from "@/schemas";
import { authErrorMessage, sendPasswordReset } from "@/services/auth";
import TextInput from "@/elements/text-field";
import { cephLoginImage } from "@/public/images";
import { RoutePaths } from "../route-paths";

const ForgotPasswordForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { handleSubmit, handleChange, values, errors, touched } =
    useFormik<ForgotPasswordI>({
      initialValues: { email: "" },
      validationSchema: FORGOTPASSWORDSCHEMA,
      onSubmit: async ({ email }) => {
        setSubmitting(true);
        try {
          await sendPasswordReset(email);
          setSentTo(email.trim());
        } catch (err) {
          toast.error(authErrorMessage(err));
        } finally {
          setSubmitting(false);
        }
      },
    });

  return (
    <main className="w-full">
      <div className="grid w-full gap-x-5 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 w-full flex flex-col justify-center md:h-screen"
        >
          <div className="bg-white p-4 rounded-xl border shadow-[grey] shadow-sm w-full">
            <section>
              <div className="flex flex-row gap-x-2 items-center -ml-2">
                <Image src={cephLoginImage} alt="logo" className="rounded-full h-10 w-10" />
                <h2 className="text-black font-bold text-2xl">CephVision</h2>
              </div>
            </section>

            <h1 className="text-xl font-bold mt-16 text-black">Forgot password?</h1>

            {sentTo ? (
              <section className="mt-5 text-black" role="status">
                <p>
                  If an account exists for <strong>{sentTo}</strong>, we&apos;ve sent a
                  link to reset your password. Check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => setSentTo(null)}
                  className="mt-3 underline"
                >
                  Use a different email
                </button>
              </section>
            ) : (
              <>
                <p className="mt-2 text-black">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
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
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 bg-green-950 w-full cursor-pointer py-3 rounded-[10px] text-white font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send reset link"}
                </button>
              </>
            )}

            <div className="mt-4 text-base">
              <Link href={RoutePaths.LOGIN} className="text-black underline">
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default ForgotPasswordForm;
