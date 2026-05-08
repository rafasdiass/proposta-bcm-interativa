import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TestFormData {
  testField: string;
}

const DependencyTest: React.FC = () => {
  const { register, handleSubmit } = useForm<TestFormData>();
  const currentDate = new Date();

  const onSubmit = (data: TestFormData) => {
    console.log('Form data:', data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="text-green-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Dependencies Test
        </h2>
      </div>

      <div className="space-y-4">
        {/* Framer Motion Test */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-blue-50 rounded border"
        >
          <p className="text-sm text-blue-700">
            ✅ Framer Motion: Animation working
          </p>
        </motion.div>

        {/* Lucide React Test */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded border">
          <Calendar className="text-green-600" size={20} />
          <p className="text-sm text-green-700">
            ✅ Lucide React: Icons working
          </p>
        </div>

        {/* date-fns Test */}
        <div className="p-3 bg-purple-50 rounded border">
          <p className="text-sm text-purple-700">
            ✅ date-fns:{' '}
            {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        {/* React Hook Form Test */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 bg-amber-50 rounded border"
        >
          <div className="flex gap-2">
            <input
              {...register('testField')}
              placeholder="Test React Hook Form"
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
            >
              Test
            </button>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            ✅ React Hook Form: Form handling working
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default DependencyTest;
