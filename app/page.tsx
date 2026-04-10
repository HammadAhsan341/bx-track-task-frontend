import Link from 'next/link';

export default function Home(): JSX.Element {
  return (
    <main>
      <div className="card stack">
        <h1>Multi-Tenant CRM</h1>
        <p className="small">Open the customer workspace to manage records for the logged-in user organization.</p>
        <Link href="/customers">Open Customers</Link>
      </div>
    </main>
  );
}
