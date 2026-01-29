import { useSnapshot } from 'valtio'
import { authState, logout, updateProfile, resetPassword } from '../store/auth'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Avatar } from '../components/ui/Avatar'
import { Alert } from '../components/ui/Alert'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, LogOut, Check } from 'lucide-react'

export function ProfilePage() {
    const { user, loading, error } = useSnapshot(authState)
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.user_metadata?.name || '')
    const [successMsg, setSuccessMsg] = useState('')

    const handleUpdate = async () => {
        setSuccessMsg('')
        const result = await updateProfile({ name })
        if (result.success) {
            setIsEditing(false)
            setSuccessMsg('Profile updated successfully')
        }
    }

    const handlePasswordReset = async () => {
        if (confirm('Send password reset email?')) {
            const result = await resetPassword(user.email)
            if (result.success) {
                setSuccessMsg('Password reset email sent')
            }
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>

            {successMsg && (
                <Alert variant="success" onDismiss={() => setSuccessMsg('')} dismissible>
                    {successMsg}
                </Alert>
            )}

            {error && (
                <Alert variant="error" onDismiss={() => { }} dismissible>
                    {error}
                </Alert>
            )}

            {/* Profile Card */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-white" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar
                            size="xl"
                            name={user?.user_metadata?.name || user?.email}
                            className="w-20 h-20 text-2xl"
                        />
                        <div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                            >
                                Change Avatar
                            </Button>
                            <input type="file" id="avatar-upload" className="hidden" />
                            <p className="text-xs text-white/40 mt-2">
                                JPG, GIF or PNG. Max size of 800K
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <Input
                            label="Full Name"
                            value={isEditing ? name : (user?.user_metadata?.name || 'Not set')}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            rightIcon={!isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-6">Edit</Button>}
                        />
                        {isEditing && (
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleUpdate} loading={loading}>Save Changes</Button>
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            value={user?.email}
                            disabled
                            leftIcon={<Mail className="w-4 h-4" />}
                            rightIcon={user?.email_confirmed_at && <Check className="w-4 h-4 text-green-400" />}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-white" />
                        Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <h4 className="font-medium text-white">Password</h4>
                            <p className="text-sm text-white/50">Last changed just now</p>
                        </div>
                        <Button variant="outline" onClick={handlePasswordReset}>
                            Reset Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logout */}
            <div className="flex justify-end">
                <Button variant="danger" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

export default ProfilePage
