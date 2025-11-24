import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, Droplet, Clock } from 'lucide-react';
import { IrrigationLog } from '@/types/agrisense';
import { motion } from 'framer-motion';

interface IrrigationHistoryProps {
  logs: IrrigationLog[];
}

export const IrrigationHistory = ({ logs }: IrrigationHistoryProps) => {
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'manual':
        return 'bg-secondary/20 text-secondary-foreground';
      case 'auto':
        return 'bg-primary/20 text-primary-foreground';
      case 'scheduled':
        return 'bg-info/20 text-info';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getActionColor = (action: string) => {
    return action === 'ON' ? 'text-success' : 'text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-6 shadow-medium">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Irrigation History</h3>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Droplet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No irrigation history yet</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Droplet className={`w-5 h-5 mt-0.5 ${getActionColor(log.action)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <Badge variant="outline" className={getModeColor(log.mode)}>
                        {log.mode}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                      {log.duration && <span>• {log.duration}s</span>}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};
