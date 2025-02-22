import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

export const ConfirmDialog = ({
    children,
    onConfirm,
}: ConfirmModalProps ) => {
  return (
      <AlertDialog>
          <AlertDialogTrigger asChild>
              {children}
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle> Ви дійсно впевнені? </AlertDialogTitle>
                  <AlertDialogDescription> Цю дію не можна буде скасувати. </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel> Скасувати </AlertDialogCancel>
                  <AlertDialogAction onClick={onConfirm}> Продовжити </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
  )
}