import client from "@/config/client";
import { _handleAxiosError } from "@/services/request.service";
import { SignInI } from "@/types/auth";
// import { useMutation, UseMutationResult} from "@tanstack/react-query";
import { AxiosError } from "axios";



export interface SignInResponse {
  token:string;
  user:{
    id :string 
    name :string
    role : string 
    createdAt :string  
  }
  message:string
  status: string
}

export const useSignIn = () => {
    
}

// export const useSignIn = (): UseMutationResult<
//   SignInResponse,
//   AxiosError<unknown>,
//   SignInI
// > => {
//   const signInMutation = useMutation<
//     SignInResponse,
//     AxiosError<unknown>,
//     SignInI
//   >({
//     mutationFn: async (data: SignInI): Promise<SignInResponse> => {
//       try {
//         const response = await client.post("/auth/login", data);
//         return response.data;
//       } catch (error) {
//         throw  _handleAxiosError(error)
//       }
//     },
//   });

//   return signInMutation;
// };
