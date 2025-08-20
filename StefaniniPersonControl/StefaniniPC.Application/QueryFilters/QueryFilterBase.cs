namespace StefaniniPC.Application.QueryFilters
{
    public class QueryFilterBase
    {
        private int pageIndex = 1;
        private int pageSize = 10;
        
        public int PageIndex
        {
            get => pageIndex;
            set
            {
                if (value > 0) pageIndex = value;
            }
        }

        public int PageSize
        {
            get => pageSize;
            set
            {
                if (value > 0) pageSize = value;
            }
        }
    }
}
