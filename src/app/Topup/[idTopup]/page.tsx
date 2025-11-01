import { supabase } from '@/app/lib/supabase';
import TopupClient from '../component/TopupClient';

export default async function Topup({ params }: Readonly<{ params: { idTopup: string } }>) {
  const { data, error } = await supabase.from('Products').select('*').eq('idProduct', params.idTopup).single();

  if (error) {
        return (
            <div className="text-slate-50 p-10">
                <p>{error.message}</p>
            </div>
        )
    }

  return <TopupClient product={data} />;
}