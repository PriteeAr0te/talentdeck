import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/ButtonNew";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  username?: string;
  profileCreated?: boolean;
}

interface DeleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteProfileDialog: React.FC<DeleteProfileDialogProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const {user, setUser} = useAuth();

  const handleDelete = async () => {
    try {
      const res = await API.delete("/profile");

      if (res.status === 200) {
        toast.success("Profile deleted successfully.");

        const updatedUser: User = {
          ...(user as User),
          profileCreated: false,
        };

        delete updatedUser.username;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        onOpenChange(false);
        router.push("/profile/create");
      }
    } catch (err) {
        console.log("Error deleting profile:", err);
      toast.error("Failed to delete profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProfileDialog;
