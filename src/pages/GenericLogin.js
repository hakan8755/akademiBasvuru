import { useParams } from 'react-router-dom';

export default function GenericLogin() {
    const { role } = useParams();   // juri / yonetici / admin
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">/{role}/login – Bu sayfa henüz implemente edilmedi</h1>
        </div>
    );
}
