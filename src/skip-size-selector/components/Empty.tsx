import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import React from "react";

function Empty({ resetFilters }: { resetFilters: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Filter className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No skips found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your filters to see more results.
      </p>
      <Button onClick={resetFilters} variant="outline">
        Reset Filters
      </Button>
    </div>
  );
}

export default Empty;
