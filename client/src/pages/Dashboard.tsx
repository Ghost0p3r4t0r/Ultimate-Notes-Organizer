import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Plus, Archive, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const stats = [
  { label: 'Collections', value: '0', icon: Folder, color: 'text-blue-500' },
  { label: 'Total Items', value: '0', icon: Archive, color: 'text-green-500' },
  { label: 'Favorites', value: '0', icon: Star, color: 'text-yellow-500' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Folder className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No collections yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first collection to get started
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
