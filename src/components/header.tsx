import { Button } from "@/components/ui/button";

interface AppHeaderProps {
	isEditing: boolean;
	setIsEditing: (value: boolean) => void;
}

const Header: React.FC<AppHeaderProps> = ({ isEditing, setIsEditing }) => (
	<div className="flex justify-between items-center mb-6">
		<h1 className="text-3xl font-bold">Budgetable</h1>
		<Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
			{isEditing ? "Lock" : "Unlock"} Editing
		</Button>
	</div>
);

export default Header;
