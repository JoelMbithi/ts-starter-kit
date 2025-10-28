import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  isSameDay,
  isSameWeek,
  isSameMonth,
} from 'date-fns';
import { useMemo, useState, memo } from 'react';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

export interface Order {
  id: number;
  total: number;
  created_at: string;
}

interface SalesChartProps {
  orders: Order[];
  loading?: boolean;
}

interface ChartDataPoint {
  label: string;
  sales: number;
  date?: string;
}

// Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length > 0) {
    const val = Number(payload[0]?.value ?? 0);
    const data = payload[0]?.payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
        {data?.date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.date}</p>
        )}
        <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
          Ksh {val.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Sales Overview Chart
 */
const SalesChart = memo(function SalesChart({ orders, loading = false }: SalesChartProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    if (period === 'day')
      return orders.filter((o) => isSameDay(new Date(o.created_at), now));
    if (period === 'week')
      return orders.filter((o) => isSameWeek(new Date(o.created_at), now, { weekStartsOn: 1 }));
    return orders.filter((o) => isSameMonth(new Date(o.created_at), now));
  }, [orders, period]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (loading || !filteredOrders?.length) return [];

    const groupBy = (keyFn: (o: Order) => string): Map<string, number> => {
      const map = new Map<string, number>();
      filteredOrders.forEach((o) => {
        const key = keyFn(o);
        map.set(key, (map.get(key) ?? 0) + Number(o.total ?? 0));
      });
      return map;
    };

    const now = new Date();

    // TODAY — Hourly
    if (period === 'day') {
      const hourly = groupBy((o) => {
        const d = new Date(o.created_at);
        return `${d.getHours()}:00`;
      });
      return Array.from({ length: 24 }, (_, h) => ({
        label: `${h.toString().padStart(2, '0')}:00`,
        sales: hourly.get(`${h}:00`) ?? 0,
      }));
    }

    // WEEKLY — Daily
    if (period === 'week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: now });
      const daily = groupBy((o) => format(new Date(o.created_at), 'yyyy-MM-dd'));
      return days.map((d) => ({
        label: format(d, 'EEE'),
        sales: daily.get(format(d, 'yyyy-MM-dd')) ?? 0,
        date: format(d, 'MMM d'),
      }));
    }

    // MONTHLY — Weekly
    const monthStart = startOfMonth(now);
    const weeks = eachWeekOfInterval({ start: monthStart, end: now }, { weekStartsOn: 1 });
    const weekly = groupBy((o) => {
      const d = new Date(o.created_at);
      const weekStart = startOfWeek(d, { weekStartsOn: 1 });
      return format(weekStart, 'yyyy-MM-dd');
    });
    return weeks.map((w) => ({
      label: `Week ${format(w, 'w')}`,
      sales: weekly.get(format(w, 'yyyy-MM-dd')) ?? 0,
      date: `${format(w, 'MMM d')} - ${format(
        new Date(w.getTime() + 6 * 24 * 60 * 60 * 1000),
        'MMM d'
      )}`,
    }));
  }, [filteredOrders, period, loading]);

  const totalSales = filteredOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const periodConfig = {
    day: { icon: Clock, label: 'Today', color: 'text-blue-600' },
    week: { icon: Calendar, label: 'This Week', color: 'text-purple-600' },
    month: { icon: TrendingUp, label: 'This Month', color: 'text-green-600' },
  };
  const PeriodIcon = periodConfig[period].icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-md transition-all hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 ${periodConfig[period].color}`}
          >
            <PeriodIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Overview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {periodConfig[period].label}
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map((p) => {
            const config = periodConfig[p];
            const Icon = config.icon;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{config.label}</span>
                <span className="sm:hidden">{p === 'day' ? 'D' : p === 'week' ? 'W' : 'M'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Total Revenue */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
        <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
          Ksh {totalSales.toFixed(2)}
        </span>
      </div>

      {/* Chart */}
      <div className="h-64 -mx-6 -mb-6 mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        ) : chartData.every((d) => d.sales === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No sales data available</p>
            <p className="text-xs mt-1">Sales will appear here once orders are placed</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `Ksh${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '5 5' }} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#salesGradient)"
                dot={{ fill: '#14b8a6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

export default SalesChart;
