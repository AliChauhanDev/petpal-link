import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWindow from "@/components/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, MessageCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<{
    id: string;
    name: string;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchConversations = async () => {
      // Get all messages for the user
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!messages || messages.length === 0) {
        setLoading(false);
        return;
      }

      // Group by conversation partner
      const conversationMap = new Map<string, typeof messages>();
      messages.forEach((msg) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)!.push(msg);
      });

      // Get partner profiles
      const partnerIds = Array.from(conversationMap.keys());
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", partnerIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      // Build conversation list
      const convList: Conversation[] = partnerIds.map((partnerId) => {
        const msgs = conversationMap.get(partnerId)!;
        const profile = profileMap.get(partnerId);
        const unread = msgs.filter(
          (m) => m.sender_id === partnerId && !m.read
        ).length;

        return {
          id: partnerId,
          name: profile?.full_name || "Unknown User",
          avatar: profile?.avatar_url || null,
          lastMessage: msgs[0].content,
          lastMessageTime: msgs[0].created_at,
          unreadCount: unread,
        };
      });

      setConversations(convList);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages-list")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Messages</h1>
              <p className="text-muted-foreground">Connect with other pet owners</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              No Messages Yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start a conversation by contacting pet owners from lost or found reports
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-2xl">
            {filteredConversations.map((conv, index) => (
              <div
                key={conv.id}
                onClick={() =>
                  setActiveChat({ id: conv.id, name: conv.name, avatar: conv.avatar })
                }
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in ${
                  index !== filteredConversations.length - 1 ? "border-b border-border" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conv.avatar || undefined} />
                  <AvatarFallback>{conv.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conv.lastMessageTime), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Chat Window */}
      {activeChat && (
        <ChatWindow
          receiverId={activeChat.id}
          receiverName={activeChat.name}
          receiverAvatar={activeChat.avatar}
          onClose={() => setActiveChat(null)}
        />
      )}

      <Footer />
    </div>
  );
}
