import {
	Dialog,
	DialogTitle,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
	onConfirm: () => void;
}

const DeleteDialog = ({ onConfirm }: DeleteDialogProps) => (
	<Dialog>
		<DialogTrigger asChild>
			<Button variant="destructive">Delete</Button>
		</DialogTrigger>
		<DialogContent>
			<DialogTitle>Delete Row</DialogTitle>
			<DialogHeader>Are you sure you want to delete this row?</DialogHeader>
			<DialogFooter>
				<Button onClick={onConfirm} variant="destructive">
					Yes, delete
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default DeleteDialog;
