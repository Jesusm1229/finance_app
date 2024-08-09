import { Sheet, SheetContent, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { useNewAccount } from "../hooks/use-new-account";
import AccountForm from "./account-form";
import { insertAccountsSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";


const formSchema = insertAccountsSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>


export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        });//this will call the useCreateAccount hook
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    New Account
                </SheetHeader>
                <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "" }} />
                <SheetDescription>
                    Create a new account to start tracking your finances.
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}