import { useState } from "react";
import { characters } from "@/data/characters";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Characters() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = characters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadgeClass = (role: string) => {
    if (role === "hero") return "bg-re-blue/20 text-re-blue border-re-blue/30";
    if (role === "villain") return "bg-re-red/20 text-re-red border-re-red/30";
    return "bg-re-green/20 text-re-green border-re-green/30";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-black font-mono tracking-tighter">
        CHARACTER <span className="text-re-red">DATABASE</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search characters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="hero">Heroes</SelectItem>
            <SelectItem value="villain">Villains</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground font-mono">{filtered.length} characters found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="group relative p-5 rounded-xl border border-border/50 bg-card hover:border-re-red/40 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--re-red)/0.1)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground group-hover:text-re-red transition-colors">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">ID: {c.id}</p>
              </div>
              <Badge variant="outline" className={roleBadgeClass(c.role)}>
                {c.role}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
