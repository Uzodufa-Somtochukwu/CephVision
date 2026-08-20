import * as yup from "yup";

export const SIGNINSCHEMA = yup.object().shape({
    email:yup.string().required('email is required').email('Email is not valid'),
    password: yup.string().required('password is required')
})

export const CREATESESSIONSCHEMA = yup.object().shape({
    name: yup.string().required("Session is required").matches(/^\d{4}\/\d{4}$/, 'Session must be in YYYY/YYYY Format'),
})
export const CHANGETERMSCHEMA = yup.object().shape({
    term_id:yup.string().required('Term is required'),
    start_date: yup.string().required("Start Date is required"),
    end_date: yup.string().required("End Date is required")
})

export const ADMINSCHEMA = yup.object().shape({
    username: yup.string().required('username is required'),
    phone: yup.string().required('Phone Number is required'),
    email: yup.string().required('Email is required').email('Enter valid email'),
    role: yup.string().required('Role is required'),
    password: yup.string().optional(),
})

export const EDITADMINSCHEMA = yup.object().shape({
    username: yup.string().required('name is required'),
    phone: yup.string().required('Phone Number is required'),
    email: yup.string().required('Email is required').email('Enter valid email'),
    role: yup.string().required('Role is required'),
})




export const FORGOTPASSWORDSCHEMA = yup.object().shape({
    email: yup.string().required('Email is required').email('Enter valid email'),
})

export const CONFIRMPASSWORDSCHEMA = yup.object().shape({
    // code:yup.string().required('Code is required'),
    password: yup.string().required('Password is required').min(6, 'password must be atleast 6 characters'),
    // confirm_password: yup
    // .string()
    // .required('Please confirm your password')
    // .oneOf([yup.ref('password')], 'Password must match'),
})

export const CHANGEPASSWORDSCHEMA = yup.object().shape({
    password: yup.string().required('New password is required').min(6, 'password must be atleast 6 characters'),
    old_password: yup.string().required('Old password is required'),
})

export const UPDATESCHOOLSCHEMA = yup.object().shape({
    email: yup.string().required('Email is required').email('Enter valid email'),
    phone_number: yup.string().required('Phone Number is required').max(11).matches(/^(?:(?:81|91|70|80|90|71|081|091|070|080|090|071)\d{8,})$/, 'Enter a valid phone number'),
    category: yup.string().required("School category is required"),
    board: yup.string().required("School board is required")
})


export const ADDEXAMINATIONSCHEMA = yup.object().shape({
    title: yup.string().required('Title is required'),
    purpose: yup.string().required('Purpose is required'),
    term: yup.string().required('Term is required'),
    eligible_class: yup.array().min(1, 'Please select at least one class').required('Eligible classes is required'),
    amount:yup.string().required('Amount is required'),
    all_class:yup.boolean().oneOf([true, false], 'Please select an option')
    .required('All class is requires')
})



