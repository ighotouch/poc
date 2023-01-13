export interface IComingSoon {}
const ComingSoon: React.FC<IComingSoon> = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="mt-4">Feature available soon</h1>
    </div>
  );
};

export default ComingSoon;
