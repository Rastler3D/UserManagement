import React, { useState, useEffect } from 'react';
import { useAuth, User } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LockIcon, UnlockIcon, Trash2Icon, UserIcon, LogOutIcon } from 'lucide-react'


export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { logout, user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/User', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else if (response.status == 401) {
            logout();
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleAction = async (action: 'block' | 'unblock' | 'delete') => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/User/Action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action, userIds: selectedUsers }),
        });

        if (response.ok) {
            await fetchUsers();
            setSelectedUsers([]);
        } else {
            console.error('Failed to perform action');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                    <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0">{user?.displayName}</h1>
                    <Button variant="outline" onClick={logout}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <Card className="w-full max-w-4xl mx-auto mt-8 place-self-start">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <UserIcon className="mr-2" />
                            User Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handleAction('block')}
                                disabled={selectedUsers.length === 0 || selectedUsers.every(id => users.find(x => x.id == id)!.status == "Blocked")}
                            >
                                <LockIcon className="mr-2 h-4 w-4" />
                                Block
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleAction('unblock')}
                                disabled={selectedUsers.length === 0 || selectedUsers.every(id => users.find(x=> x.id == id)!.status == "Active")}
                            >
                                <UnlockIcon className="mr-2 h-4 w-4" />
                                Unblock
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleAction('delete')}
                                disabled={selectedUsers.length === 0}
                            >
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <ScrollArea className="h-[600px] rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedUsers.length === users.length}
                                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                />
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Registered At</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.id)}
                                                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{new Date(user.registeredAt).toLocaleString()}</TableCell>
                                                <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};