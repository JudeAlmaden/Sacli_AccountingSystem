import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Pencil } from 'lucide-react';
import type { User } from '@/types/database';

interface SpecialUserCardProps {
    title: string;
    users: User[];
    icon: any;
    onEdit: (user: User) => void;
    onAssign?: () => void;
}

export function SpecialUserCard({
    title,
    users,
    icon: Icon,
    onEdit,
    onAssign
}: SpecialUserCardProps) {
    const user = users[0];

    return (
        <Card className="overflow-hidden border-t-4 border-t-primary/20 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                            <Icon className="size-5" />
                        </div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                    </div>
                    {!user && onAssign && (
                        <Button variant="ghost" size="icon" onClick={onAssign}>
                            <Pencil className="size-4" />
                        </Button>
                    )}
                </div>

                {user ? (
                    <>
                        <div className="flex-1 mb-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1.5">
                                    <p className="font-medium text-base">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.status === 'active'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {user.status}
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(user)}>
                            Edit User
                        </Button>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-4 text-center space-y-3">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                            <UserPlus className="size-5 text-muted-foreground/60" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">No user assigned</p>
                            <p className="text-xs text-muted-foreground/80">Assign a user to this role</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
