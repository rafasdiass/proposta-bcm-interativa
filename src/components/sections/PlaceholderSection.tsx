import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
  description?: string;
}

/**
 * Placeholder Section Component
 *
 * Temporary component for sections that haven't been implemented yet
 * Provides consistent layout and indicates work in progress
 */
export default function PlaceholderSection({
  title,
  description = 'Esta seção está sendo desenvolvida e será implementada em breve.',
}: PlaceholderSectionProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 rounded-full">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        <div className="flex items-center justify-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          Em desenvolvimento
        </div>
      </motion.div>
    </div>
  );
}
