import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi, type DashboardData } from '@/features/dashboard/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Folder, Heart, ImageIcon, Archive, Plus, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <motion.div variants={itemAnim}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MiniBarChart({ data }: { data: { name: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-24 text-xs text-muted-foreground truncate">{d.name}</span>
          <div className="flex-1 h-5 rounded-md bg-muted overflow-hidden">
            <div
              className="h-full rounded-md transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color || '#3b82f6' }}
            />
          </div>
          <span className="w-8 text-right text-xs font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = data || { totalCollections: 0, totalItems: 0, totalMedia: 0, totalFavorites: 0, collectionStats: [], recentItems: [], activities: [] };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
        </div>
        <Button asChild>
          <Link to="/collections">
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Link>
        </Button>
      </div>

      <motion.div variants={itemAnim} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Collections" value={stats.totalCollections} icon={Folder} color="text-blue-500" />
        <StatCard label="Total Items" value={stats.totalItems} icon={Archive} color="text-green-500" />
        <StatCard label="Images & Files" value={stats.totalMedia} icon={ImageIcon} color="text-purple-500" />
        <StatCard label="Favorites" value={stats.totalFavorites} icon={Heart} color="text-red-500" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemAnim}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                Items per Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.collectionStats.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No collections yet.</p>
              ) : (
                <MiniBarChart
                  data={stats.collectionStats.map((c) => ({
                    name: c.name,
                    value: c.itemCount,
                    color: c.themeColor || '#3b82f6',
                  }))}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnim}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Items
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-72 overflow-y-auto">
              {stats.recentItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No items yet.</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentItems.map((item) => {
                    const title = Object.values(item.fieldValues).find((v) => typeof v === 'string' && v.length > 0) || 'Untitled';
                    return (
                      <Link
                        key={item.id}
                        to={`/items/${item.id}`}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <span className="truncate flex-1">{String(title).slice(0, 50)}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-[10px]">{item.collectionName}</Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemAnim}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p>
            ) : (
              <div className="relative space-y-0">
                {stats.activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      {index < stats.activities.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
