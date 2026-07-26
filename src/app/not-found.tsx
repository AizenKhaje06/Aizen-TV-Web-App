import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Container>
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
