import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountProfile() {
    return (
        <ProtectedRoute>
            <Layout title={"Perfil"}>

            </Layout>
        </ProtectedRoute>
    )
}