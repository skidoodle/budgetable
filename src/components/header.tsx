import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AppHeaderProps {
	isEditing: boolean;
	setIsEditing: (value: boolean) => void;
}

const Header = ({ isEditing, setIsEditing }: AppHeaderProps) => (
	<div className="flex justify-between items-center mb-6">
		<h1 className="text-4xl font-bold">
			<Link
				href="/"
				className="text-blue-500 hover:text-blue-600 transition-colors"
				onClick={() => setIsEditing(false)}
			>
				Budgetable
			</Link>
		</h1>
		<Button variant="ghost" onClick={() => setIsEditing(!isEditing)} size="lg">
			<span className="text-lg">{isEditing ? "Lock" : "Unlock"} Editing</span>
		</Button>
	</div>
);

export default Header;
