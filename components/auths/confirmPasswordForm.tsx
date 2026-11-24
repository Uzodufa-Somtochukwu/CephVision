import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ResetPasswordI } from "@/types/auth";
import { RESETPASSWORDSCHEMA } from "@/schemas";
import { authErrorMessage, confirmReset, verifyResetCode } from "@/services/auth";
import TextInput from "@/elements/text-field";
import { cephLoginImage } from "@/public/images";
import { RoutePaths } from "../route-paths";

type LinkState =
  | { status: "checking" }
  | { status: "ready"; email: string }
  | { status: "invalid"; message: string };

const ConfirmPasswordForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const oobCode = params.get("oobCode");
  const mode = params.get("mode");

  const malformed = !oobCode || (!!mode && mode !== "resetPassword");
  const [checked, setChecked] = useState<Exclude<LinkState, { status: "checking" }> | null>(null);
  const link: LinkState = malformed
    ? { status: "invalid", message: "This reset link is invalid." }
    : checked ?? { status: "checking" };
  const [submitting, setSubmitting] = useState(false);

  // Check the code in the emailed link before showing the form.
  useEffect(() => {
    if (malformed || !oobCode) return;
    let cancelled = false;
    verifyResetCode(oobCode)
      .then((email) => !cancelled && setChecked({ status: "ready", email }))
      .catch(
        (err) =>
          !cancelled && setChecked({ status: "invalid", message: authErrorMessage(err) })
      );
    return () => {
      cancelled = true;
    };
  }, [oobCode, malformed]);

  const { handleSubmit, handleChange, values, errors, touched } =
    useFormik<ResetPasswordI>({
      initialValues: { password: "", confirm_password: "" },
      validationSchema: RESETPASSWORDSCHEMA,
      onSubmit: async ({ password }) => {
        if (!oobCode) return;
        setSubmitting(true);
        try {
          await confirmReset(oobCode, password);
          toast.success("Password updated. Please log in.");
          router.replace(RoutePaths.LOGIN);
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

            <h1 className="text-xl font-bold mt-16 text-black">Set a new password</h1>

            {link.status === "checking" && (
              <p className="mt-5 text-black" role="status">
                Checking your link...
              </p>
            )}

            {link.status === "invalid" && (
              <section className="mt-5 text-black" role="alert">
                <p>{link.message}</p>
                <Link href={RoutePaths.FORGOTPASSWORD} className="mt-3 inline-block underline">
                  Request a new link
                </Link>
              </section>
            )}

            {link.status === "ready" && (
              <>
                <p className="mt-2 text-black">
                  Choose a new password for <strong>{link.email}</strong>.
                </p>
                <section className="mt-5">
                  <TextInput
                    value={values.password}
                    label="New password"
                    onChange={handleChange}
                    err={!!errors.password && touched.password}
                    errMessage={errors.password}
                    type="password"
                    name="password"
                    placeHolder="***********"
                    className="w-full border "
                  />
                </section>
                <section>
                  <TextInput
                    value={values.confirm_password}
                    label="Confirm password"
                    onChange={handleChange}
                    err={!!errors.confirm_password && touched.confirm_password}
                    errMessage={errors.confirm_password}
                    type="password"
                    name="confirm_password"
                    placeHolder="***********"
                    className="w-full border "
                  />
                </section>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 bg-green-950 w-full cursor-pointer py-3 rounded-[10px] text-white font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Updating..." : "Update password"}
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
export default ConfirmPasswordForm;
