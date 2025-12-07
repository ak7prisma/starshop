import { supabase } from '@/app/lib/supabase';
import TopupClient from '../component/TopupClient';

type Props = {
  params: Promise<{ idTopup: string }>
}

export default async function Topup({ params }: Readonly<Props>) {
  const { idTopup } = await params;

  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('idProduct', idTopup)
    .single();

  if (error) {
    return (
      <div className="text-slate-50 p-10">
        <p>{error.message}</p>
      </div>
    )
  }

  return <TopupClient product={data} />;
}